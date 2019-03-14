console.log("Steerable Class - Loaded");

var util = {
    vector2d: function (x, y) {
        var v = {
            x: x || 0,
            y: y || 0,
            add: function (v) {
                this.x += v.x;
                this.y += v.y;
                return this;
            },
            subtract: function (v) {
                this.x -= v.x;
                this.y -= v.y;
                return this;
            },
            normalise: function () {
                var len = this.length();
                this.x /= len;
                this.y /= len;
                return this;
            },
            scale: function (s) {
                this.x *= s;
                this.y *= s;
                return this;
            },
            truncate: function(max) {
              var i = max / this.length()
              i = i < 1.0 ? i : 1.0
              this.scale(i)
            },
            length: function () {
                return Math.sqrt((this.x * this.x) + (this.y * this.y));
            },
            rotate: function (a) {
                var angle = (this.toAngle() * 180 / Math.PI) + a
                this.angleTo(angle);
                return this;
            },
            toAngle: function () {return -Math.atan2(-this.y, this.x) },
            angleTo: function (rad) {
                var len = this.length();
                this.x = len * Math.cos(rad);
                this.y = len * Math.sin(rad);
                return this;

            },
            limit: function(max){//Limits vector length to length of max as a scalar
              if(this.length() > max){
                this.normalise().scale(max)
              }
              return this;
            },
            set: function (x, y) {
                this.x = x;
                this.y = y;
                return this;
            },
            clone: function () {
                return util.vector2d(this.x, this.y)
            }

        }
        return v
    },
    fromMatter: function (matterVector){
      // console.log(matterVector.x, matterVector.y);
      return util.vector2d(matterVector.x, matterVector.y)
    },
    toMatter: function(vector2d){
      return {x: vector2d.x, y: vector2d.y}
    }

}



var steeringSys = {
  IDLE    : 0,
  SEEK    : 1,
  FLEE    : 2,
  ARRIVAL : 3,
  WANDER  : 4,
  PURSUIT : 5,
  EVADE   : 6,
  FOLLOW  : 7
}

var commands = {
  HOLD   : 0,
  MOVE   : 1,
  ATTACK : 2

}

let UnitMaker = new class{
  Steerable(scene, x, y, texture, frame, options){
    var s = new Steerable(scene, x, y, texture, frame, options)
    return s
  }
  BaseUnit(scene, x, y, texture, frame, options){
    var u = new BaseUnit(scene, x, y, texture, frame, options)
    return u
  }
  SlowUnit(scene, x, y, texture, frame, options){
    var u = new SlowUnit(scene, x, y, texture, frame, options)
    return u
  }
}
class Steerable extends Phaser.GameObjects.Sprite {

  constructor(scene, x, y, texture, frame, options){
    super(scene, x, y, texture, frame, options)

    this.scene = scene
    this.scene.add.existing(this)
    this.scene.impact.add.existing(this)

    this.body.collides = Phaser.Physics.Impact.COLLIDES.NEVER

    this.formation = null;


    this.moveMode = steeringSys.ARRIVAL;

    this.rotationLock = true;

    this.body.pos = util.vector2d(this.body.pos.x, this.body.pos.y)
    this.position               = this.body.pos
    this.body.vel = util.vector2d(0,0)
    this.linearVelocity         = this.body.vel
    this.desiredVelocity        = util.vector2d(0,0)
    this.steering               = util.vector2d(0,0)
    this.objective              = new Objective()
    this.orientation            = this.body.angle // In Radians
    this.maxLinearSpeed         = 400;
    this.maxLinearAcceleration  = 300;
    this.maxAngularSpeed        = 4;
    this.maxAngularAcceleration = 3;



    this.proximityRange = 100;
    this.fleeDistance   = 50;
    this.maxDistance    = 0;

    this.displacement = 0;
    this.wanderPos    = util.vector2d(0,0);
    this.wanderForce  = util.vector2d(0,0);
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
      case steeringSys.IDLE    : this.idle(); break;
      case steeringSys.SEEK    : this.seek(this.objective.position, 0); break;
      case steeringSys.ARRIVAL : this.seek(this.objective.position, 50); break;
      case steeringSys.FLEE    : this.flee(); break;
      case steeringSys.WANDER  : this.wander(); break;
      case steeringSys.PURSUIT : this.pursuit(); break;
      case steeringSys.EVADE   : this.evade(); break;
      case steeringSys.FOLLOW  : this.follow(); break;
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
    this.seek(this.objective.position, 100, 20)
  }

  seek(target, radius, brace){
    brace = brace || 0

      this.rotationLock = true
    var force = util.vector2d(0,0)
    var distance;
    this.desiredVelocity = target.clone().subtract(this.getPosition())
    distance = this.desiredVelocity.length()
    this.desiredVelocity.normalise();
    if (distance <= radius - brace){

      this.desiredVelocity.scale(this.maxLinearSpeed * (distance)/(radius - brace))
      this.steering = this.desiredVelocity.clone().subtract(this.linearVelocity)
      this.steering.truncate(this.maxAngularSpeed * 3)
      // console.log(this.maxLinearSpeed * distance/radius);
    } else {
      this.desiredVelocity.scale(this.maxLinearSpeed)
      this.steering = this.desiredVelocity.clone().subtract(this.linearVelocity)
      this.steering.truncate(this.maxAngularSpeed)
    }

    if(distance <= radius / 2){
      this.rotationLock = false
    }

    this.steering = this.desiredVelocity.clone().subtract(this.linearVelocity)
    this.steering.truncate(this.maxAngularSpeed)
    this.steering.add(this.linearVelocity)
    this.steering.truncate(this.maxLinearSpeed)

    this.setLinearVelocity(this.steering)
  }

  flee(){
    this.rotationLock = true
    var force = util.vector2d(0,0)
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

  wander(){

  }

  pursuit(){

  }

  evade(){

  }

  follow(){

  }

}

class BaseUnit extends Steerable{
  constructor(scene, x, y, texture, frame, options){
    super(scene, x, y, texture, frame, options)
    this.rating = 1;

    this.target = null;

  }

  update(){
    switch(this.objective.action){
      case commands.HOLD   : this.hold();   break;
      case commands.MOVE   : this.move();   break;
      case commands.ATTACK : this.attack(); break;
    }
    super.update()
  }
  hold(){
    this.moveMode = steeringSys.IDLE
  }
  move(){
    this.moveMode = steeringSys.ARRIVAL
  }
}
class FastUnit extends BaseUnit{
  constructor(scene, x, y, texture, frame, options){
    super(scene, x, y, texture, frame, options)
    this.rating = 12;
    this.maxLinearSpeed = 300
  }
}
class SlowUnit extends BaseUnit{
  constructor(scene, x, y, texture, frame, options){
    super(scene, x, y, texture, frame, options)
    this.rating = 30;
    this.maxAngularSpeed = 0.4;
    this.maxAngularAcceleration = 0.1;
    this.maxLinearSpeed = 80
  }
}
