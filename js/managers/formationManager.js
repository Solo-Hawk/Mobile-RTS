class Formation{
  constructor(gameManager, units, flagship, team){
    console.log(units, flagship);
    this.type = "formation"
    this.team = team || gametools.statics.teams.NEUTRAL
    this.gameManager = gameManager;
    this.units = units || []
    this.flagship = {rating: 0};
    this.children = []
    this.formation = gametools.statics.formations.T
    this.objective = null
    this.lastcheck = this.gameManager.gameScene.time.now
    this.checkInterval = 500;
    this.units.forEach((unit)=>{if(unit.formation != this && unit.formation != undefined){unit.setFormation(this)}},this)
    console.log(this);
    this.setFlagship()


  }
  addUnit(unit){
    console.log("ADDING", this.units.indexOf(unit) != -1);
    if(this.units.indexOf(unit) != -1)return
    this.units.push(unit)
    unit.setFormation(this)
    this.setFlagship()
  }
  removeUnit(unit){
    console.log("REMOVING UNIT");
    console.log(this.units);
    this.units.splice(this.units.indexOf(unit),1)
    console.log(this.units);
    this.setFlagship()
  }

  refresh(){
    this.units.forEach((unit)=>{
      if(unit.formation != this){
        unit.setFormation(this)
      }
    },this)
  }

  setFlagship(){
    console.log("FLAGSHIP IS BEING SET");
    for(var i = 0; i < this.units.length; i++){
      console.log(this.units[i].rating);
      console.log(this.units[i].rating > this.flagship.rating);
      if(this.units[i].rating > this.flagship.rating){
        this.flagship = this.units[i]
        this.objective = this.flagship.Objective
      }
    }
    this.children = this.units.slice(0)

    console.log(this.children);
    this.children.splice(this.children.indexOf(this.flagship),1)

    console.log(this.children);
    if(this.team == gametools.statics.teams.PLAYER){
      this.flagship.setInteractive({useHandCursor:true}).on('pointerdown', () => {this.gameManager.uiScene.updateMenu(this.flagship.formation)})
    }

  }



  update(){
    if(this.units.length == 0){
      this.gameManager.formations.splice(this.gameManager.formations.indexOf(this), 1)
    }

    if(this.gameManager.gameScene.time.now - this.lastcheck > this.checkInterval){
      var attackTarget = this.gameManager.getNearestFormation(this, this.flagship.range)
      if(attackTarget){
        console.log(attackTarget);
      }
      this.lastcheck = this.gameManager.gameScene.time.now
    }

    switch (this.flagship.objective.action) {
      case gametools.statics.commands.HOLD   :
        this.children.forEach((unit)=>{unit.setObjective(this.flagship.objective)}, this)
        break;
      case gametools.statics.commands.MOVE   :
        // console.log("FORMATION SAYS MOVE", this);
        var placements = gametools.utils.formator.T(this.children.length, 100 , this.flagship.getPosition(), this.flagship.rotation)
        for(var i = 0; i < placements.length; i++){
          var unitPos = placements[i]
          // console.log(this.children[i]);
          this.children[i].setObjective(new Objective(unitPos.x, unitPos.y, gametools.statics.commands.MOVE))
        }
        break;
      case gametools.statics.commands.ATTACK : break;
    }


  }

}

class Objective{
  constructor(x,y,action){
    this.target = gametools.utils.vector.vector2d(x,y)
    this.action = action || gametools.statics.commands.HOLD
  }
  setTarget(vector){
    this.target = vector
  }
  setAction(action){
    this.action = action
  }
  distanceFrom(pos){
    return this.target.clone().subtract(pos).length()
  }
}
