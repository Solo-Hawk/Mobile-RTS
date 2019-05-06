class BaseShip extends Steerable{
  constructor(scene, x, y, texture, team){
    super(scene, x, y, texture)
    // console.log(x,y);
    this.type = "unit"
    this.rating = 1;
    this.health = 100;
    this.alive = true;
    this.team = team || Game.Utils.statics.teams.NEUTRAL;
    this.attachments = [];
    this.formation = scene.gameManager.create.formation(this.team, [this])
    this.target = Game.Utils.statics.BLANK;
    this.mode = Game.Utils.statics.commands.IDLE

    this.maxLinearSpeed = 3000
    this.maxLinearAcceleration = 600

    this.longest = this.width > this.height ? this.width : this.height
    this.shortest = this.width < this.height ? this.width : this.height
    this.state = 1
  }
  setScale(s){
    super.setScale(s)

    this.body.offset.x = (this.width * s)/2
    this.body.offset.y = (this.height * s)/2
    this.longest = this.width > this.height ? this.width : this.height
    this.shortest = this.width < this.height ? this.width : this.height
  }
  setTarget(target){
    if(!target)return
    // console.log("Got Target",target);
    // console.log(target.type);
    this.target = target || Game.Utils.statics.BLANK
  }
  getTarget(){
      return this.target
    }

  update(target){

    super.update()
    this.updateAttachments()
  }
  checkAttachments(){
    this.attachments.forEach((a)=>{
      a.update()
    })
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
  damage(d){
    this.health -= d
    if(this.health <= 0){
      this.alive = false
    }
  }
  disconnect(){
    this.attachments.forEach((a)=>{
      a.host = 0
      a.destroy()
    })
  }
  getNearestTarget(){
    var closestUnit;
    var closestDistance;
    this.formation.target.ships.forEach((ship)=>{
      var distance = this.distanceFrom(ship)
      if(closestDistance){
          if(distance < closestDistance){
            closestUnit = ship
            closestDistance = distance
          }
        }else{
          // console.log("Force Setting Formation");
          closestUnit = ship
          closestDistance  = distance
        }
    },this)
    return closestUnit
  }
}

class Fighter extends BaseShip{
  constructor(scene, x, y, texture, team){
    super(scene, x, y, texture, team)
    this.ranges = {
      attackRange : 1400,
      evadeRange  : 1000,
      returnRange : 3000,
      engageRange : 7000
    }

  }
  update(target){
    if(!this.target.alive)return
    if(!this.alive){
      this.idle()
      super.update()
      return
    }

    this.target = target || this.target

      /*
      1- Attacking
      2- Evading Target
      3-
      4-
      */
      switch (this.state) {
        case 1:
          this.seek(this.target.getPosition(),this.maxLinearAcceleration,30)
          if(this.distanceFrom(this.target) >= this.ranges.engageRange && this.formation.flagship != this){
            this.state = 4
          }else if(this.distanceFrom(this.target) <= this.ranges.evadeRange + this.target.longest){
            this.state = 2
          }
          break;
        case 2:
          this.wander(10000,4)
          // this.wander(10000,20)
          // this.setLinearVelocityLength(this.linearVelocity.length() + this.maxLinearAcceleration)
          // if(this.distanceFrom(this.target) <= this.ranges.engageRange + this.target.longest){
          //   this.target = this.getNearestTarget() || this.target
          //   this.state = 1
          // }
          if(this.distanceFrom(this.target) >= this.ranges.returnRange){
            this.state = 3
          }else if(this.distanceFrom(this.target) >= this.ranges.engageRange && this.formation.flagship != this){
            this.state = 4
          }

          break;
        case 3:
          this.pursuit(this.target, 300);
          // this.setLinearVelocityLength(this.linearVelocity.length() + this.maxLinearAcceleration)
          if(this.distanceFrom(this.target) <= this.ranges.attackRange){
            this.target = this.getNearestTarget() || this.target
            this.state = 1
          }
          break;
        case 4:
          this.seek(this.formation.getFormationPosition(this),1,1)
          // this.setLinearVelocityLength(this.linearVelocity.length() + this.maxLinearAcceleration)
          if(this.distanceFrom(this.target) <= this.ranges.engageRange){
            this.state = 3
          }
          break;

      }




    super.update()
  }
}

class Frigate extends BaseShip{
  constructor(scene, x, y, texture, team){

    // console.log(x,y);
    super(scene, x, y, texture, team)
    this.ranges = {
      idleRange:3000,
      maintainRange:4000,
      engageRange: 6000
    }
    this.setDepth(3)

  }
  update(target){
    // if(!this.alive)console.log("Waiting to die");

    // if(!this.target.alive)console.log("TARGET IS DEAD");
    // if(!this.target.alive)console.log(this.target);
    if(!this.target.alive)return
    if(!this.alive){
      this.idle()
      super.update()
      return
    }

    this.target = target || this.target
    if(this.target == Game.Utils.statics.BLANK){
      // console.log("no target");
      return
    }
      // console.log(this.state);
      /*
      1- Attacking
      2- Evading Target
      3-
      4-
      */
      // console.log(this.state, this.formation.flagship == this);
      // console.log(this.state);
      switch (this.state) {
        case 1:

          // console.log("Seek");
          this.seek(this.target.getPosition(),this.ranges.maintainRange / 2)
          if(this.distanceFrom(this.target) >= this.ranges.engageRange && this.formation.flagship != this){
            this.state = 4
          }
          if(this.distanceFrom(this.target) <= this.ranges.idleRange){
            this.state = 3
          }
          break;
        case 2:
          // console.log("Evade");
          this.evade(this.target)
          this.setLinearVelocityLength(this.linearVelocity.length() + this.maxLinearAcceleration)
          if(this.distanceFrom(this.target) <= this.ranges.engageRange + this.target.longest){
            this.target = this.getNearestTarget() || this.target
            this.state = 1
          }if(this.distanceFrom(this.target) >= this.ranges.engageRange && this.formation.flagship != this){
            this.state = 4
          }

          break;
        case 3:
          // console.log("Idle");
          this.idle()
          // console.log(!(this.distanceFrom(this.target) <= this.ranges.idleRange));
          // console.log(this.distanceFrom(this.target) <= this.ranges.engageRange + this.target.longest);
          if(this.distanceFrom(this.target) >= this.ranges.engageRange && this.formation.flagship != this){
            this.state = 4
          }
          if(!(this.distanceFrom(this.target) <= this.ranges.idleRange)){
            if(this.distanceFrom(this.target) >= this.ranges.engageRange + this.target.longest){
              this.target = this.getNearestTarget() || this.target
              this.state = 1
            }
          }
          break;
        case 4:
          this.seek(this.formation.getFormationPosition(this),1,1)
          this.setLinearVelocityLength(this.linearVelocity.length() + this.maxLinearAcceleration)
          if(this.distanceFrom(this.target) <= this.ranges.engageRange){
            this.target = this.getNearestTarget() || this.target
            this.state = 1
          }
          break;

      }




    super.update()
  }
}
