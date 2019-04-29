class GameUtils{
  constructor(){
    this.vector2d = class{
      constructor(x,y) {
        this.x = x || 0;
        this.y = y || 0;
        this.type = "vector2d"
      }
      add(v) {
        this.x += v.x;
        this.y += v.y;
        return this.fix();
      }
      subtract(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this.fix();
      }
      normalise () {
        var len = this.length();
        this.x /= len;
        this.y /= len;
        return this.fix();
      }
      scale(s) {
        this.x *= s;
        this.y *= s;
        return this.fix();
      }
      truncate(max) {
        var i = max / this.length()
        i = i < 1.0 ? i : 1.0
        return this.scale(i).fix()
      }
      length() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
      }
      rotate(a) {
        var angle = this.toAngle() + a
        this.angleTo(angle);
        return this.fix();
      }
      toAngle() {return -Math.atan2(-this.y, this.x) }
      angleTo(rad) {
        var len = this.length();
        this.x = len * Math.cos(rad);
        this.y = len * Math.sin(rad);
        return this.fix();

      }
      limit(max){//Limits vector length to length of max as a scalar
        if(this.length() > max){
          this.normalise().scale(max)
        }
        return this.fix();
      }
      set(x, y) {
          this.x = x;
          this.y = y;
          return this.fix();
      }
      clone() {
          return new Game.Utils.vector2d(this.x, this.y)
      }
      fix() {
        this.x.toFixed(10)
        this.y.toFixed(10)
        return this
      }
    }
    this.formator = new Formator()
    this.statics = this.getStatics()
  }

  getStatics(){
    return {
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
      },
      BLANK: 0
    }
  }
}

class Formator{
  constructor(){

  }
  T(formation){
    // var placements = []
    // var length = spacing * (count - 1)
    // for(var i = 0; i < count; i++){
    //   var vector = gametools.utils.vector.vector2d((spacing*i) -(length/2), spacing)
    //   vector.rotate(facing + Phaser.Math.DegToRad(-90))
    //   vector.add(pos)
    //   placements.push(vector)
    // }
    // return placements
  }

}

var Game = {
  Utils: new GameUtils()
}
