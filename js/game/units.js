console.log("Steerable Class - Loaded");


class Steerable extends Phaser.GameObjects.Sprite {

  constructor(gameManager, scene, x, y, texture, objective){
    super(scene, x, y, texture)

    this.scene = scene
    this.scene.add.existing(this)

    this.setOrigin(0.5, 0.5)
    this.scene.impact.add.existing(this)

    this.body.collides = Phaser.Physics.Impact.COLLIDES.NEVER

    this.moveMode = gametools.statics.steeringBehaviours.ARRIVAL;




    this.objective = objective || new Objective(x,y)

    this.rotationLock = true;

    this.body.pos = gametools.utils.vector.vector2d(this.body.pos.x, this.body.pos.y)
    this.position               = this.body.pos
    this.body.vel = gametools.utils.vector.vector2d(0,0)
    this.linearVelocity         = this.body.vel
    this.desiredVelocity        = gametools.utils.vector.vector2d(0,0)
    this.steering               = gametools.utils.vector.vector2d(0,0)

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
  clearObjective(){
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
      case gametools.statics.steeringBehaviours.SEEK    : this.seek(this.objective.target, 0); break;
      case gametools.statics.steeringBehaviours.ARRIVAL : this.seek(this.objective.target, 100); break;
      case gametools.statics.steeringBehaviours.FLEE    : this.flee(); break;
      case gametools.statics.steeringBehaviours.WANDER  : this.wander(); break;
      case gametools.statics.steeringBehaviours.PURSUIT : this.pursuit(); break;
      case gametools.statics.steeringBehaviours.EVADE   : this.evade(); break;
      case gametools.statics.steeringBehaviours.FOLLOW  : this.follow(); break;
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
  constructor(gameManager,scene, x, y, texture, team, formation){
    super(gameManager,scene, x, y, texture)
    this.type = "unit"
    this.rating = 4;
    this.health = 1
    this.range = 800;
    this.team = team || gametools.statics.teams.NEUTRAL
    this.attachments = []
    this.formation = formation || gameManager.factory.add.Formation([this], this, this.team)

  }

  update(){
    switch (this.objective.action) {
      case gametools.statics.commands.HOLD:
        // console.log("idle");
        this.idle()
        break;
      case gametools.statics.commands.MOVE:
        // console.log(this);
        this.seek(this.objective.target, 100)
        break;
      case gametools.statics.commands.ATTACK:

        break;

    }
    if(this.formation){
      if(this.objective.distanceFrom(this.position) <= 50 && this.formation.flagship != this){
        this.setRotation(Phaser.Math.Angle.RotateTo(
          this.rotation,
          this.formation.flagship.rotation,
          0.015
        ))

      }else{
        this.setRotation(Phaser.Math.Angle.RotateTo(
          this.rotation,
          this.linearVelocity.toAngle(),
          0.03
        ))
      }


    }
  }

  setFormation(formation){
    this.formation.removeUnit(this)
    this.formation = formation
  }

  destroy(){
  }

}

class SlowUnit extends BaseUnit{
  constructor(gameManager,scene, x, y, texture, team, formation){
    super(gameManager,scene, x, y, texture, team, formation)
    this.rating = 40;
    this.maxLinearSpeed = 50
    this.maxLinearAcceleration = 30
    this.maxAngularSpeed = 2
    this.maxAngularAcceleration = 1
  }
}
class FastUnit extends BaseUnit{
  constructor(gameManager,scene, x, y, texture, team, formation){
    super(gameManager,scene, x, y, texture, team, formation)
    this.rating = 10;
    this.maxLinearSpeed = 150
    this.maxLinearAcceleration = 80
    this.maxAngularSpeed = 6
    this.maxAngularAcceleration = 5
  }
}
