
var gametools = {
  utils: {
    vector: {
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
                  var angle = this.toAngle() + a
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
                  return gametools.utils.vector.vector2d(this.x, this.y)
              }

          }
          return v
      }
    },
    formator:{
      T:(count, spacing, pos, facing)=>{
        var placements = []
        var length = spacing * (count - 1)
        for(var i = 0; i < count; i++){
          var vector = gametools.utils.vector.vector2d((spacing*i) -(length/2), spacing)
          vector.rotate(facing + Phaser.Math.DegToRad(-90))
          vector.add(pos)
          placements.push(vector)
        }
        return placements

      }
    }


  },
  statics:{
    steeringBehaviours:{
      IDLE    : 0,
      SEEK    : 1,
      FLEE    : 2,
      ARRIVAL : 3,
      WANDER  : 4,
      PURSUIT : 5,
      EVADE   : 6,
      FOLLOW  : 7
    },
    commands:{
      HOLD   : 0,
      MOVE   : 1,
      ATTACK : 2
    },
    formations:{
      T      : 0,
      DELTA  : 1,
      LEADER : 2,
      TWIN   : 3,
      EAGLE  : 4,
      VIC    : 5,
      VULCAN : 6

    },
    teams:{
      NEUTRAL : 0,
      PLAYER  : 1,
      COMPUTER: 2
    }
  }
}
