console.log("Steerable Class - Loaded");


class Steerable extends Phaser.GameObjects.Sprite {

  constructor(scene, x, y, texture, frame, options){
    super(scene, x, y, texture, frame, options)

    this.scene = scene
    this.scene.add.existing(this)
    this.scene.impact.add.existing(this)

    this.body.collides = Phaser.Physics.Impact.COLLIDES.NEVER

    this.formation = null;


    this.moveMode = gametools.statics.steeringBehaviours.ARRIVAL;

    this.rotationLock = true;

    this.body.pos = gametools.utils.vector.vector2d(this.body.pos.x, this.body.pos.y)
    this.position               = this.body.pos
    this.body.vel = gametools.utils.vector.vector2d(0,0)
    this.linearVelocity         = this.body.vel
    this.desiredVelocity        = gametools.utils.vector.vector2d(0,0)
    this.steering               = gametools.utils.vector.vector2d(0,0)
    this.objective              = new Objective()
    this.orientation            = this.body.angle // In Radians
    this.maxLinearSpeed         = 100;
    this.maxLinearAcceleration  = 50;
    this.maxAngularSpeed        = 4;
    this.maxAngularAcceleration = 3;



    this.proximityRange = 100;
    this.fleeDistance   = 50;
    this.maxDistance    = 0;

    this.displacement = 0;
    this.wanderPos    = gametools.utils.vector.vector2d(0,0);
    this.wanderForce  = gametools.utils.vector.vector2d(0,0);
    console.log(this);


  }

  getPosition(){
    return this.position.clone()
  }

  getLinearVelocity(){
    return this.linearVelocity.clone()
  }

  setLinearVelocity(velocity){
    this.linearVelocity.x = velocity.x
    this.linearVelocity.y = velocity.y
  }
  addLinearVelocity(velocity){
    this.linearVelocity.x += velocity.x
    this.linearVelocity.y += velocity.y
  }

  setTarget(target){
    this.target = target
  }

  setMoveMode(moveMode){
    this.moveMode = moveMode
  }

  setObjective(objective){
    this.objective = objective
  }

  clearObjecective(){
    this.objective = new Objective()
  }

  update(){
      this.applySteering()
  }

  lockRotation(lock){
    this.rotationLock = lock
  }

  applySteering(){
    switch(this.moveMode){
      case gametools.statics.steeringBehaviours.IDLE    : this.idle(); break;
      case gametools.statics.steeringBehaviours.SEEK    : this.seek(this.objective.position, 0); break;
      case gametools.statics.steeringBehaviours.ARRIVAL : this.seek(this.objective.position, 100); break;
      case gametools.statics.steeringBehaviours.FLEE    : this.flee(); break;
      case gametools.statics.steeringBehaviours.WANDER  : this.wander(); break;
      case gametools.statics.steeringBehaviours.PURSUIT : this.pursuit(); break;
      case gametools.statics.steeringBehaviours.EVADE   : this.evade(); break;
      case gametools.statics.steeringBehaviours.FOLLOW  : this.follow(); break;
    }
    if(this.rotationLock || this.formation.flagship == this) {
      this.setRotation(Phaser.Math.Angle.RotateTo(
        this.rotation,
        this.linearVelocity.toAngle(),
        0.05
      ))
    }else{
      if(this.formation){
        this.setRotation(Phaser.Math.Angle.RotateTo(
          this.rotation,
          this.formation.flagship.rotation,
          0.025
        ))
      }
    }
  }

  idle(){
    this.desiredVelocity = this.linearVelocity.clone().scale(0.9)
    this.setLinearVelocity(this.desiredVelocity)
  }

  seek(target, radius, brace){
    brace = brace || 0

    this.rotationLock = true
    var force = gametools.utils.vector.vector2d(0,0)
    var distance;

    this.desiredVelocity = target.clone().subtract(this.position)
    distance = this.desiredVelocity.length()
    this.desiredVelocity.normalise()

    if (distance <= radius){
      this.desiredVelocity.scale(this.maxLinearSpeed * (distance / radius))
    }else{
      this.desiredVelocity.scale(this.maxLinearSpeed)
    }

    if(distance <= radius / 2) this.rotationLock = false
    this.force = this.desiredVelocity.subtract(this.linearVelocity)

    this.addLinearVelocity(this.force)
  }

  flee(){
    this.rotationLock = true
    var force = gametools.utils.vector.vector2d(0,0)
    var distance;
    this.desiredVelocity = target.clone().subtract(this.getPosition())
    distance = this.desiredVelocity.length()
    this.desiredVelocity.normalise();
    this.desiredVelocity.scale(this.maxLinearSpeed).scale(-1)
    this.steering = this.desiredVelocity.clone().subtract(this.linearVelocity)
    this.steering.truncate(this.maxAngularSpeed)
    this.steering.add(this.linearVelocity)
    this.steering.truncate(this.maxLinearSpeed)

    this.setLinearVelocity(this.steering)
  }

}

class BaseUnit extends Steerable{
  constructor(scene, x, y, texture, frame, options){
    super(scene, x, y, texture, frame, options)
    this.rating = 1;
    this.health = 1
    this.team = gametools.statics.teams.NEUTRAL
    this.target = null;
    this.attachments = []

  }

  update(){
    switch(this.objective.action){
      case gametools.statics.commands.HOLD   : this.hold();   break;
      case gametools.statics.commands.MOVE   : this.move();   break;
      case gametools.statics.commands.ATTACK : this.attack(); break;
    }
    super.update()
  }
  hold(){
    this.moveMode = gametools.statics.steeringBehaviours.IDLE
  }
  move(){
    this.moveMode = gametools.statics.steeringBehaviours.ARRIVAL
  }
  destroy(){
    this.formation.removeUnits([this])
    this.formation.organise()
    this.formation = null;
    this.attachments.forEach((attachment) => {
      attachment.destroy()
    })
    this.scene.gameManager.removeUnit(this)
  }
}
class FastUnit extends BaseUnit{
  constructor(scene, x, y, texture, frame, options){
    super(scene, x, y, texture, frame, options)
    this.rating = 12;
    this.maxAngularSpeed = 4;
    this.maxAngularAcceleration = 1.4;
    this.maxLinearSpeed = 100
    this.maxLinearAcceleration = 80
  }
}
class SlowUnit extends BaseUnit{
  constructor(scene, x, y, texture, frame, options){
    super(scene, x, y, texture, frame, options)
    this.rating = 60;
    this.maxAngularSpeed = 0.4;
    this.maxAngularAcceleration = 0.1;
    this.maxLinearSpeed = 40
    this.maxLinearAcceleration = 20
  }
}
