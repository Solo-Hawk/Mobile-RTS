class Formation{
  constructor(units){
    this.units = units || []
    this.flagship = units[0] || {rating: 0}
    var pos = units[0].getPosition()
    this.objective = new MoveTo(pos.x, pos.y)

    this.ring ={
      units: [],
      max: 6,
      radius : 100
    }

    this.findFlagship()
    this.organise()

  }
  addUnits(units){
    this.units.concat(units)
    this.organise()
  }
  removeUnits(units){
    units.forEach(() => {
      this.formation.units.splice(this.formation.units.indexOf(this),1)
    })
  }
  setObjective(objective){
    console.log("objective called");
    console.log(objective);
    this.flagship.setObjective(objective)
  }
  getFlagshipPos(){
    var pos = this.flagship.getPosition()
    return gametools.utils.vector.vector2d(pos.x, pos.y)
  }
  organise(){
    this.units.forEach((unit)=>{unit.formation = this}, this)
    var toSort = Array.from(this.units)
    toSort.splice(toSort.indexOf(this.flagship),1)
    this.ring.units = toSort;
  }
  update(){
    var ring = this.generateRing(this.flagship, this.ring.units.length, this.ring.radius)
    for(var i = 0; i < this.ring.units.length; i++){
      this.ring.units[i].setObjective(ring[i])
    }
    var pos = this.getFlagshipPos()
    if(this.flagship.objective.distanceFrom(pos) < 20 && this.flagship.objective.action !=gametools.statics.commands.HOLD){
      console.log("OBJECTIVE REACHED");
      var objPos = this.flagship.objective.position
      this.setObjective(new Hold(objPos.x,objPos.y))
    }
  }
  generateRing(flagship, count, radius){
    var rot = (360 * Math.PI/180) / count;
    var ring = []
    var pos = flagship.position.clone()
    pos.add(flagship.linearVelocity)
    for(var i = 0; i < count; i++){
      var unitPos = gametools.utils.vector.vector2d(pos.x, pos.y)
      var ringShift = gametools.utils.vector.vector2d(radius,0)
      ringShift.angleTo(this.flagship.rotation + (rot*i))
      unitPos.add(ringShift)
      ring.push(new MoveTo(unitPos.x, unitPos.y))
    }
    return ring
  }

  findFlagship(){
    for(var i = 0; i < this.units.length; i++){
      console.log(this.units[i].rating);
      if(this.units[i].rating > this.flagship.rating){
        this.flagship = this.units[i]
      }
    }
  }
}

class Objective{
  constructor(x, y){
    this.position = gametools.utils.vector.vector2d(x,y)
    this.action = gametools.statics.commands.HOLD
  }
  distanceFrom(pos){
    return pos.clone().subtract(this.position).length()
  }
}
class Hold extends Objective{
  constructor(x,y){
    x = x || 0
    y = y || 0
    super(x,y)
    this.action = gametools.statics.commands.HOLD

  }
}
class MoveTo extends Objective{
  constructor(x,y){
    super(x,y)
    this.action = gametools.statics.commands.MOVE

  }
}
class Attack extends Objective{
  constructor(x,y){
    super(x,y)
    this.action =gametools.statics.commands.ATTACK
  }
}
