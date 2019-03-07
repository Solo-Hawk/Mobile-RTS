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


class Steerable extends Phaser.GameObjects.Sprite {
  static IDLE     = 0
  static SEEK     = 1;
  static FLEE     = 2;
  static ARRIVAL  = 3;
  static WANDER   = 4;
  static PURSUIT  = 5;
  static EVADE    = 6;
  static FOLLOW   = 7;

  constructor(scene, x, y, texture, frame, options){
    super(scene, x, y, texture, frame, options)
    this.debug = {}

    this.scene = scene;
    this.setScale(0.4)

    scene.matter.add.gameObject(this);
    scene.add.existing(this);
    this.body.parent = this;
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
    this.maxLinearSpeed         = 0;
    this.maxLinearAcceleration  = 0;
    this.maxAngularSpeed        = 0;
    this.maxAngularAcceleration = 0;



    this.proximityRange = 100;
    this.fleeDistance   = 50;
    this.maxDistance    = 0;

    this.displacement = 0;
    this.wanderPos    = util.vector2d(0,0);
    this.wanderForce  = util.vector2d(0,0);
    console.log(this);
  }

  update(){
    if(!this.target || !this.target.position || !this.target.linearVelocity){
      console.warn("target undefined - Target, position or linearVelocity is undefined")
      return;
    }
    switch(this.moveMode){
      case Steerable.IDLE    : this.idle(); break;
      case Steerable.SEEK    : this.seek(); break;
      case Steerable.ARRIVAL : this.arrival(); break;
      case Steerable.WANDER  : this.wander(); break;
      case Steerable.PURSUIT : this.pursuit(); break;
      case Steerable.EVADE   : this.evade(); break;
      case Steerable.FOLLOW  : this.follow(); break;
    }
  }
  idle(){
    console.log("idle");
  }
  seek(){
    console.log("seek");
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
