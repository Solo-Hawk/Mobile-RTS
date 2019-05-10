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
    if(!this.flagship.alive)this.findFlagship()
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
      if(this.ships[i].rating > this.flagship.rating || this.flagship == Game.Utils.statics.BLANK || !this.flagship.alive){
        if(!(this.flagship == Game.Utils.statics.BLANK)){
          this.flagship.maxLinearSpeed*= 1.25
          this.flagship.maxLinearAcceleration*= 1.25
        }
        this.flagship = this.ships[i]
      }
    }
    this.ships.sort((a,b)=>{
      return a.rating - b.rating
    })
    if(this.flagship == Game.Utils.statics.BLANK)
    {
      // console.log("BLANK");
      return
    }
    this.flagship.maxLinearSpeed*= 0.8
    this.flagship.maxLinearAcceleration*= 0.8
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
    //Forms a ring
    var subs = Game.Utils.arrayRemove(this.ships, this.flagship)

    var shipPos = subs.indexOf(ship)
    // console.log(subs.length);
    var placements = []
    var spacing = this.flagship.longest * 2
    var c = 0
    var i = 0
    while(c<subs.length){
      var ringLevel = i;
      var ringSize = (i+1) * 8
      var current = c
      // console.log(subs.length);
      // console.log(i,c);
      // console.log(ringLevel);
      // console.log(ringSize);
      // console.log(subs.length - current );
      // console.log((subs.length - current < ringSize ? subs.length - current : ringSize));
      for(var j = 0; j <(subs.length - current < ringSize ? subs.length - current : ringSize); j++){
        if(c == shipPos){
          var vector = Game.Utils.vector2d((spacing*(i+1)),0)
          vector.rotate(this.flagship.rotation + Phaser.Math.DegToRad(((360 / (subs.length - current < ringSize ? subs.length - current : ringSize)) * (j + 1))-45))
          vector.add(this.flagship.getPosition())
          return vector
        }
        // console.log("push");
        c++

      }
      i++
      // console.log(subs.length);
      // console.log(c<subs.length-1);
    }

    // console.log("Iterated", c);



    // for(var i = 0; i < Math.ceil(subs.length / 8); i++){
    //   for(var j = 0; j < ((subs.length - (i*8)) < 8 ? subs.length - (i * 8) + 1 : 8); j++){
    //     var vector = Game.Utils.vector2d((spacing*i),0)
    //     vector.rotate(this.flagship.rotation + Phaser.Math.DegToRad((360 / 8) * (j + 1)))
    //     vector.add(this.flagship.getPosition())
    //     placements.push(vector)
    //   }
    // }


    //Forms Support Lines
    /*{
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
    }*/




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


  }

}


class Objective{
  constructor(target, command){
    this.target = target;
    this.command = command || Game.Utils.statics.BLANK
  }
}
