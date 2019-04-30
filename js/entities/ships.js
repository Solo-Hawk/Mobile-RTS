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
    this.formationDisplacement =
    this.target = Game.Utils.statics.BLANK;
    this.mode = Game.Utils.statics.commands.IDLE
    this.ranges = {
      attackRange : 800,
      evadeRange  : 300,
      returnRange : 4000,
      engageRange : 3000
    }

    this.maxLinearSpeed = 2000
    this.maxLinearAcceleration = 150


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
    if(this.mode == Game.Utils.statics.commands.IDLE){
      this.idle()
    }
    if(this.mode == Game.Utils.statics.commands.MOVE){
      console.log("Move Mo");
      this.seek(this.target.getPosition())
    }
    if(this.mode == Game.Utils.statics.commands.ATTACK){
      // console.log(this.state);
      switch (this.state) {
        case 1:
          // console.log("Pursuit to Target");
          this.pursuit(this.target);
          if(this.distanceFrom(this.target) <= this.linearVelocity.length() * 3){
            this.state = 2;
          }
          break;
        case 2:
          // console.log("Evade to Target");
          this.evade(this.target)
          this.setLinearVelocityLength(this.linearVelocity.length() + this.maxLinearAcceleration)
          if(this.distanceFrom(this.target) >= this.ranges.returnRange){
            this.state = 3
          }else if(this.formation.flagship != this){
            if(this.distanceFrom(this.formation.flagship) <= this.ranges.returnRange / 4){
              this.state = 4
            }
          }

          break;
        case 3:
          // console.log("Seeking to Target");
          this.seek(this.target.getPosition(),100)
          if(this.distanceFrom(this.target) <= this.ranges.attackRange){
            this.state = 1
          }
          break;
        case 4:
          // // console.log("Returning to FS", this.formation.flagship.getPosition());
          this.seek(this.formation.flagship.getPosition(),0)
          if(this.distanceFrom(this.formation.flagship) <= 800){
            this.state = 3
          }
          this.state = 3
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
