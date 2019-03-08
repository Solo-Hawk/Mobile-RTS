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
      return util.vector2d(matterVector.x, matterVector.y)
    },
    toMatter: function(vector2d){
      return {x: vector2d.x, y: vector2d.y}
    }

}

var matterSys = {
  BODY: Phaser.Physics.Matter.Matter.Body,
  VECTOR: Phaser.Physics.Matter.Matter.Vector
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

class Steerable extends Phaser.GameObjects.Sprite {

  constructor(scene, x, y, texture, frame, options){
    super(scene, x, y, texture, frame, options)
    this.debug = {}

    this.scene = scene;

    scene.matter.add.gameObject(this);
    scene.add.existing(this);


    this.setScale(0.4)
    matterSys.BODY.scale(this.body, 0.4, 0.4)
    //^^^^^^^^^^^^^^^^^^^^^
    //The core to the custom object

    //NOTICE - THIS ISN'T THE BEST PRACTICE BUT THIS IS BEING DONE FOR THE SAKE OF THE DEVLEOPMENT | IT WILL BE REVIEWED

    this.moveMode = Steerable.IDLE;

    this.position               = util.fromMatter(this.body.position)
    this.linearVelocity         = util.fromMatter(this.body.velocity)
    this.desiredVelocity        = util.vector2d(0,0)
    this.steering               = util.vector2d(0,0)
    this.target                 = null
    this.orientation            = this.body.angle // In Radians
    this.maxLinearSpeed         = 10;
    this.maxLinearAcceleration  = 4;
    this.maxAngularSpeed        = 7;
    this.maxAngularAcceleration = 3;



    this.proximityRange = 100;
    this.fleeDistance   = 50;
    this.maxDistance    = 0;

    this.displacement = 0;
    this.wanderPos    = util.vector2d(0,0);
    this.wanderForce  = util.vector2d(0,0);
    console.log(this);
  }
  setTarget(target){
    this.target = target
  }

  setMoveMode(moveMode){
    this.moveMode = moveMode
  }

  update(){
    this.position       = util.fromMatter(this.body.position)
    if(!this.target || !this.target.position || !this.target.linearVelocity){
      // console.warn("target undefined - Target, position or linearVelocity is undefined")
      return;
    }
    // Sets the positon and velocity properties to custom vector2d

    this.linearVelocity = util.fromMatter(this.body.velocity);

    switch(this.moveMode){
      case steeringSys.IDLE    : this.idle(); break;
      case steeringSys.SEEK    : this.seek(); break;
      case steeringSys.ARRIVAL : this.arrival(); break;
      case steeringSys.WANDER  : this.wander(); break;
      case steeringSys.PURSUIT : this.pursuit(); break;
      case steeringSys.EVADE   : this.evade(); break;
      case steeringSys.FOLLOW  : this.follow(); break;
    }

    // Converts vector2d to matter vector (x and y object) and applies to BODY
    matterSys.BODY.setVelocity(this.body, util.toMatter(this.linearVelocity))


  }
  idle(){
    console.log("idle");
  }
  seek(){
    console.log("seek");
    this.desiredVelocity = this.target.position.clone()
    this.desiredVelocity.subtract(this.position)
    this.desiredVelocity.normalise()
    this.desiredVelocity.scale(this.maxLinearSpeed)
    this.steering = this.desiredVelocity.clone().subtract(this.linearVelocity)
    this.steering.scale(this.maxAngularAcceleration).limit(this.maxAngularSpeed)
    this.linearVelocity.add(this.steering.clone().scale(this.maxLinearAcceleration))
    this.linearVelocity.limit(this.maxLinearSpeed)

  }
  arrival(){
    console.log("arrival");
  }
  wander(){
    console.log("wander");
  }
  pursuit(){
    console.log("pursuit");
  }
  evade(){
    console.log("evade");
  }
  follow(){
    console.log("follow");
  }

}

class BaseUnit extends Steerable{

}
