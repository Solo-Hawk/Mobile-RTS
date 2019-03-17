
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
                  return gametools.utils.vector.vector2d(this.x, this.y)
              }

          }
          return v
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
    teams:{
      NEUTRAL : 0,
      PLAYER  : 1,
      COMPUTER: 2
    }
  }
}
