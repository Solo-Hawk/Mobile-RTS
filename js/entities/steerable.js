class Steerable extends Phaser.GameObjects.Sprite {

  constructor(scene, x, y, texture){
    super(scene, x, y, texture)

    this.scene = scene

    this.scene.add.existing(this)
    this.setOrigin(0.5, 0.5)


    this.scene.impact.add.existing(this)
    this.body.collides = Phaser.Physics.Impact.COLLIDES.LITE
    // this.moveMode = gametools.statics.steeringBehaviours.ARRIVAL;

    this.body.offset.x = this.width/2
    this.body.offset.y = this.height/2



    this.rotationLock = true;

    this.body.pos = Game.Utils.vector2d(this.body.pos.x+(this.width/2), this.body.pos.y+(this.height/2))
    this.position = this.body.pos
    this.body.vel = Game.Utils.vector2d(0,0)
    this.linearVelocity = this.body.vel
    this.desiredVelocity = Game.Utils.vector2d(0,0)
    this.steering = Game.Utils.vector2d(0,0)
    this.orientation = this.body.angle //In Radians

    this.maxLinearSpeed         = 10000;
    this.maxLinearAcceleration  = 5000;
    this.maxAngularSpeed        = 12;
    this.maxAngularAcceleration = 7;

    this.body.maxVel = {x:this.maxLinearSpeed*1.5, y:this.maxLinearSpeed*1.5}

    //Arrival and Flee Vars
    this.proximityRange = 100;
    this.fleeDistance = 50;
    this.maxDistance = 0;

    // Wander Behaviour Vars
    this.displacement = 0;
    this.wanderReach = 20;
    this.wanderPos = Game.Utils.vector2d(0,0);
    this.wanderForce = Game.Utils.vector2d(0,0);

    //Steering Forces
    this.appliableForces = []

    //Custom Debug maxLinearSpeed
    this.lines = []
    this.trace = []

  }

  getPosition(){
    return this.position.clone()
  }
  getLinearVelocity(){
    return this.linearVelocity.clone()
  }
  setLinearVelocity(linearVelocity){
    this.linearVelocity.x = linearVelocity.x;
    this.linearVelocity.y = linearVelocity.y;
  }
  addLinearVelocity(){
    this.linearVelocity.x += linearVelocity.x;
    this.linearVelocity.y += linearVelocity.y;
  }

  setLinearVelocityLength(length){
    this.linearVelocity.normalise().scale(length)
  }
  distanceFrom(t){
    return t.getPosition().subtract(this.getPosition()).length()
  }
  alignRotation(){
    this.setRotation(Phaser.Math.Angle.RotateTo(
      this.rotation,
      this.linearVelocity.toAngle(),
      0.4
    ))
  }
  applySteering(){
    // console.log(this.trace);
    this.trace.forEach((r)=>{r.destroy()})
    this.trace = []
    var forceTotal  = Game.Utils.vector2d(0,0);
    for(var i = 0; i < this.lines.length; i++){
      this.lines[i].destroy()
    }
    if(this.appliableForces.length == 0){

      this.idle()
    }else{
      var color = 0x00000f
      for(var i = 0; i < this.appliableForces.length; i++){
        // this.trace.push(this.scene.add.rectangle(pos.x + this.appliableForces[i].x+42, pos.y + this.appliableForces[i].y+47,20,20,color,1))
        forceTotal.add(this.appliableForces[i])

        color *= 16
      }
    }

    forceTotal.truncate(this.maxLinearAcceleration)
    forceTotal.add(this.linearVelocity)
    forceTotal.truncate(this.maxLinearSpeed)
    this.setLinearVelocity(forceTotal)
    this.appliableForces = []
    // this.trace.push(this.scene.add.rectangle(pos.x + forceTotal.x+42, pos.y + forceTotal.y+47,20,20,0xff0000,1))

  }

  lockRotation(lock){
    this.rotationLock = lock
  }
  update(){
    this.applySteering()
    this.alignRotation()
  }
  idle(){
    // console.log("idle");
    var force = Game.Utils.vector2d(0,0)
    force.set(this.linearVelocity.x, this.linearVelocity.y)
    force.scale(0.9)
    this.setLinearVelocity(force)
  }
  seek(target, radius, brace){
    brace = brace || 0
    // console.log("seek");
    this.desiredVelocity = target.subtract(this.getPosition())
    var distance = this.desiredVelocity.length()
    this.desiredVelocity.normalise()
    if(distance <= radius + this.linearVelocity.length() && radius != 0){
      this.desiredVelocity.scale((this.linearVelocity.length() + this.maxLinearAcceleration) * (distance/(radius + this.linearVelocity.length())))
    }else{
      this.desiredVelocity.scale(this.linearVelocity.length() + this.maxLinearAcceleration)
    }
    var force = this.desiredVelocity.subtract(this.linearVelocity)
    this.appliableForces.push(force)

  }

  flee(target){
    // console.log("flee");
    this.desiredVelocity = target.subtract(this.getPosition())
    var distance = this.desiredVelocity.length()
    this.desiredVelocity.normalise()
    this.desiredVelocity.scale((this.linearVelocity.length() + this.maxLinearAcceleration))
    this.desiredVelocity.scale(-1)
    var force = this.desiredVelocity.subtract(this.linearVelocity)
    this.appliableForces.push(force)
    // console.log("Flee");
  }
  wander(range, points){
    // console.log("wander");
    points = points || 10
    var force = this.linearVelocity.clone()
    for(var i = 0; i < points; i++){
      var displace = Game.Utils.vector2d(0,0)
      displace.scale(Math.random()*2-1)
      displace.scale(this.maxLinearAcceleration)

      force.add(displace)

    }
    force.truncate(this.maxLinearSpeed)
    // force.truncate(this.maxLinearSpeed)
    this.appliableForces.push(force)
    // console.log("Wander");
  }
  pursuit(target, radius){
    // console.log("pursuit");
    var t = target.getPosition().subtract(this.getPosition()).length()
    // console.log(s, target.linearVelocity.length());
    t = t / 10000
    // console.log(t);
    var futurePos = target.getPosition().add(target.linearVelocity.clone().scale(0.8))
    this.seek(futurePos,radius,100)

    // console.log("Pursuit");
  }
  evade(target){
    // console.log("evade");
    var distance = target.getPosition().subtract(this.getPosition()).length()
    var ahead = distance / this.maxLinearSpeed;
    if(target.linearVelocity.x == 0 && target.linearVelocity.y == 0){
      // console.log("STATIC UNIT");
      this.flee(target.getPosition())
    }else{
      this.flee(target.getPosition().add(target.linearVelocity.clone().scale(ahead)).scale(this.maxLinearAcceleration))
    }

    // console.log("Evade");
  }
  follow(){
    // console.log("Follow");
  }
}
