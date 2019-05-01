class Formation{
  constructor(manager, team, ships){
    this.manager = manager;
    this.team = team || Game.Utils.statics.teams.NEUTRAL;
    this.type = "formation"
    this.ships = ships || []
    this.flagship = Game.Utils.statics.BLANK
    this.target = Game.Utils.statics.BLANK;
  }

  update(){
    console.log("Formation updating");
    if(this.target == Game.Utils.statics.BLANK){
      console.log("Has no target")
      this.target = this.manager.getNearestTarget(this)
    }
    if(this.target != Game.Utils.statics.BLANK){
      console.log("Has target")
      this.ships.forEach((ship)=>{
        if(!ship.target.alive || ship.target == Game.Utils.statics.BLANK){
          ship.setTarget(this.target.ships[Math.floor(Math.random() * this.target.ships.length)])
        }
        ship.mode = Game.Utils.statics.commands.ATTACK
      })
    }
  }

  findFlagship(){
    console.log("finding FS");
    for(var i = 0; i < this.ships.length; i++){
      console.log(this.ships[i].rating);
      if(this.ships[i].rating > this.flagship.rating || this.flagship == Game.Utils.statics.BLANK){
        this.flagship = this.ships[i]
      }
    }
  }
  addUnit(unit){
    if(this.ships.indexOf(unit) == -1){
      unit.formation.removeUnit(unit)
      this.ships.push(unit)
      unit.formation = this
    }
  }
  removeUnit(unit){
    unit.formation = Game.Utils.statics.BLANK
    this.ships = Game.Utils.arrayRemove(this.ships, unit)
  }

  setObjective(target){
    console.log(this.objective);

  }

}


class Objective{
  constructor(target, command){
    this.target = target;
    this.command = command || Game.Utils.statics.BLANK
  }
}
