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
    // console.log("Formation updating", this);
    // console.log(this.target);
    // console.log(!this.target);
    if(!this.target){
      // console.log("Getting new target");
      this.target = this.manager.getNearestTarget(this)
      if(!this.target)return
      this.target.updateTarget()
    }
    if(this.target == Game.Utils.statics.BLANK || this.target.ships.length == 0){
      // console.log("Has no target")
      this.target = this.manager.getNearestTarget(this)
      if(!this.target)return
      this.target.updateTarget()
    }
    if(this.target != Game.Utils.statics.BLANK){
      // console.log("Has target")
      this.ships.forEach((ship)=>{
        if(!ship.alive){
          // console.log("Ships is dead removing");
          this.removeUnit(ship)
          return
        }
        // console.log(!ship.target.alive);
        // console.log(ship.target == Game.Utils.statics.BLANK);
        if(!ship.target.alive || ship.target == Game.Utils.statics.BLANK){
          // console.log(this.target);
          ship.setTarget(this.target.ships[Math.floor(Math.random() * this.target.ships.length)])
        }
        ship.mode = Game.Utils.statics.commands.ATTACK
      })
    }
  }

  findFlagship(){
    // console.log("finding FS");
    for(var i = 0; i < this.ships.length; i++){
      // console.log(this.ships[i].rating);
      if(this.ships[i].rating > this.flagship.rating || this.flagship == Game.Utils.statics.BLANK){
        this.flagship = this.ships[i]
      }
    }
    this.ships.sort((a,b)=>{
      return a.rating - b.rating
    })
    this.flagship.maxLinearSpeed*= 0.95
    this.flagship.maxLinearAcceleration*= 0.95
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
    // console.log(this.objective);

  }
  updateTarget(){
    // console.log("updating");
    this.target = this.manager.getNearestTarget(this)
    this.ships.forEach((ship)=>{
      ship.setTarget(this.target.ships[Math.floor(Math.random() * this.target.ships.length)])
      ship.mode = Game.Utils.statics.commands.ATTACK
    })
  }
  getFormationPosition(ship){
    var subs = Game.Utils.arrayRemove(this.ships, this.flagship)
    // console.log(subs.length);
    var placements = []
    var length = 400 * (subs.length - 1)
    for(var i = 0; i < Math.ceil(subs.length / 8); i++){
      var length = 400 * ((subs.length - (i*8)) < 8 ? subs.length - (i*8) + 1 : 8 )
      for(var j = 0; j < ((subs.length - (i*8)) < 8 ? subs.length - (i*8) + 1 : 8 ); j++){
        // console.log(i,j,(i*8)+j);
        var vector = Game.Utils.vector2d((400*j) -(length/2), 400*i)
            vector.rotate(this.flagship.rotation + Phaser.Math.DegToRad(-90))
            vector.add(this.flagship.getPosition())
            placements.push(vector)
      }
    }




    // for(var i = 0; i < subs.length; i++){
    //   var line = subs.splice(0*(i*10),10)
    //   for(var j = 0; j < line.length;j++){
    //     var vector = Game.Utils.vector2d((100*(j + (i*10))) -(length/2), 100*i)
    //     vector.rotate(this.flagship.rotation + Phaser.Math.DegToRad(-90))
    //     vector.add(this.flagship.getPosition())
    //     placements.push(vector)
    //
    //   }
    // }
    // var vector = Game.Utils.vector2d((100*i) -(length/2), 100)
    // vector.rotate(this.flagship.rotation + Phaser.Math.DegToRad(-90))
    // vector.add(this.flagship.getPosition())
    // placements.push(vector)

    return placements[subs.indexOf(ship)]

  }

}


class Objective{
  constructor(target, command){
    this.target = target;
    this.command = command || Game.Utils.statics.BLANK
  }
}
