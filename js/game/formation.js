class Formation{

}

class Objective{
  constructor(x,y,action){
    this.target = gametools.utils.vector.vector2d(x,y)
    this.action = action || gametools.statics.commands.HOLD
  }
  setTarget(vector){
    this.target = vector
  }
  setAction(action){
    this.action = action
  }
  distanceFrom(pos){
    return this.target.clone().subtract(pos).length()
  }
}
