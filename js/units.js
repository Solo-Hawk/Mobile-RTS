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

let UnitMaker = new class{
  Steerable(scene, x, y, texture, frame, options){
    var s = new Steerable(scene, x, y, texture, frame, options)
    return s
  }
}
class Steerable extends Phaser.GameObjects.Sprite {

  constructor(scene, x, y, texture, frame, options){
    super(scene, x, y, texture, frame, options)

    this.scene = scene
    this.scene.add.existing(this)
    this.scene.impact.add.existing(this)

    this.body.collides = Phaser.Physics.Impact.COLLIDES.NEVER




    this.moveMode = steeringSys.ARRIVAL;

    this.body.pos = util.vector2d(this.body.pos.x, this.body.pos.y)
    this.position               = this.body.pos
    this.body.vel = util.vector2d(0,0)
    this.linearVelocity         = this.body.vel
    this.desiredVelocity        = util.vector2d(0,0)
    this.steering               = util.vector2d(0,0)
    this.target                 = null
    this.orientation            = this.body.angle // In Radians
    this.maxLinearSpeed         = 300;
    this.maxLinearAcceleration  = 200;
    this.maxAngularSpeed        = 4;
    this.maxAngularAcceleration = 0.2;



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

  setLinearVelocity(vel){
    this.linearVelocity.x = vel.x
    this.linearVelocity.y = vel.y
  }
  addLinearVelocity(vel){
    this.linearVelocity.x += vel.x
    this.linearVelocity.y += vel.y
  }

  setTarget(target){
    this.target = target
  }

  setMoveMode(moveMode){
    this.moveMode = moveMode
  }

  update(){
    switch(this.moveMode){
      case steeringSys.IDLE    : this.idle(); break;
      case steeringSys.SEEK    : this.seek(this.target, 0); break;
      case steeringSys.ARRIVAL : this.seek(this.target, 50); break;
      case steeringSys.WANDER  : this.wander(); break;
      case steeringSys.PURSUIT : this.pursuit(); break;
      case steeringSys.EVADE   : this.evade(); break;
      case steeringSys.FOLLOW  : this.follow(); break;
    }
    this.setRotation(this.linearVelocity.toAngle())

  }
  idle(){

  }
  seek(target, radius){
    var force = util.vector2d(0,0)
    var distance;
    this.desiredVelocity = target.clone().subtract(this.getPosition())
    distance = this.desiredVelocity.length()
    this.desiredVelocity.normalise();
    if (distance <= radius){
      this.desiredVelocity.scale(this.maxLinearSpeed * distance/radius)
      console.log(this.maxLinearSpeed * distance/radius);
    } else {
      this.desiredVelocity.scale(this.maxLinearSpeed)
      this.desiredVelocity.truncate(this.maxAngularSpeed)
    }
    this.addLinearVelocity(this.desiredVelocity)
  }
  arrival(){

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

}
