class BaseShip extends Steerable{
  constructor(scene, x, y, texture, team){
    super(scene, x, y, texture)
    console.log(x,y);
    this.type = "unit"
    this.rating = 1;
    this.health = 100;
    this.alive = true;
    this.team = team || Game.Utils.statics.teams.NEUTRAL;
    this.attachments = [];
    this.formation = scene.gameManager.create.formation(this.team, [this])
    this.target = Game.Utils.statics.BLANK;
    this.mode = Game.Utils.statics.commands.IDLE
    this.ranges = {
      attackRange : 3000,
      evadeRange  :500,
      returnRange : 3000,
      engageRange : 6000
    }

    this.maxLinearSpeed = 3000
    this.maxLinearAcceleration = 300


    this.state = 1
  }
  setTarget(target){
    this.target = target || Game.Utils.statics.BLANK
  }
  getTarget(){
      return this.target
    }

  update(target){
    this.target = target || this.target
    if(this.target == Game.Utils.statics.BLANK){
      // console.log("no target");
      return
    }

    if(this.mode = Game.Utils.statics.commands.ATTACK){
      var attackRange = this.ranges.attackRange
      var evadeRange =  this.ranges.evadeRange
      var returnRange = this.ranges.returnRange
      var engageRange = this.ranges.engageRange
      // console.log(this.distanceFrom(this.target));
      console.log(this.state);
      switch (this.state) {
        case 1:
          // console.log("Pursuit");
          this.pursuit(this.target)
          if(this.distanceFrom(this.target) <= evadeRange){
            this.state = 2
          }
          if(this.distanceFrom(this.target) > attackRange){
            this.state = 3
          }
          break;
        case 2:
          // console.log("Evade");
          this.evade(this.target)
          // this.setLinearVelocityLength(this.linearVelocity.length() + this.maxLinearAcceleration)
          // this.wander()
          if(this.distanceFrom(this.target) >= returnRange){
            if(this.target.target == this){

              this.state = 3
            }else{
              this.state = 1
            }
          }
          break;
        case 3:
          // console.log("Retreat");
          this.seek(this.team == Game.Utils.statics.teams.PLAYER ?
            new Game.Utils.vector2d(Phaser.Math.Between(-8500, -8000), Phaser.Math.Between(-4000, 4000)) :
            new Game.Utils.vector2d(Phaser.Math.Between(8000, 8500), Phaser.Math.Between(-4000, 4000)))
          if(this.distanceFrom(this.target) >= engageRange){
            this.state = 4
          }
          break;
        case 4:
          // console.log("Moving to");
          this.seek(this.target.getPosition(), 200)
          if(this.distanceFrom(this.target) <= attackRange){
            this.state = 1
          }
          break;

      }
    }

    super.update()
    this.updateAttachments()
  }
  updateAttachments(){
    this.attachments.forEach((a)=>{
      a.update()
    })
  }
  setFormation(formation){
    this.formation.removeUnit(this)
    this.formation = formation
  }
  addAttachment(a){
    this.attachments.push(a)
  }
}

class Fighter extends BaseShip{
  constructor(scene, x, y, texture, team){

    console.log(x,y);
    super(scene, x, y, texture, team)


  }
}
