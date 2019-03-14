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
    this.units.add
    this.organise()
  }
  removeUnits(units){
    units.forEach(() => {
      this.formation.units.splice(this.formation.units.indexOf(this),1)
    })
  }
  setObjective(objective){
    console.log("objective called");
    this.flagship.setObjective(objective)
  }
  getFlagshipPos(){
    var pos = this.flagship.getPosition()
    return util.vector2d(pos.x, pos.y)
  }
  organise(){
    this.units.forEach((unit)=>{unit.formation = this}, this)
    var toSort = this.units
    toSort.splice(toSort.indexOf(this.flagship),1)
    this.ring.units = toSort;

  }
  update(){
    var ring = this.generateRing(this.getFlagshipPos(), this.ring.units.length, this.ring.radius)
    for(var i = 0; i < this.ring.units.length; i++){
      this.ring.units[i].setObjective(ring[i])
    }
    console.log(this.flagship.objective.distanceFrom(this.getFlagshipPos()));
    var pos = this.getFlagshipPos()
    if(this.flagship.objective.distanceFrom(pos) < 20 && this.flagship.objective.action != commands.HOLD){
      console.log("OBJECTIVE REACHED");
      this.setObjective(new Hold(pos.x,pos.y))
    }
  }
  generateRing(pos, count, radius){
    var rot = (360 * Math.PI/180) / count;
    var ring = []
    for(var i = 0; i < count; i++){
      var unitPos = util.vector2d(pos.x, pos.y)
      var ringShift = util.vector2d(radius,0)
      ringShift.angleTo(this.flagship.rotation + (rot*i))
      unitPos.add(ringShift)
      ring.push(new MoveTo(unitPos.x, unitPos.y))
    }
    return ring
  }

  findFlagship(){
    for(var i = 0; i < this.units.length; i++){
      if(this.units[i].rating > this.flagship.rating){
        this.centralUnit = units[i]
      }
    }
  }
}

class Objective{
  constructor(x, y){
    this.position = util.vector2d(x,y)
    this.action = commands.HOLD
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
    this.action = commands.HOLD

  }
}
class MoveTo extends Objective{
  constructor(x,y){
    super(x,y)
    this.action = commands.MOVE

  }
}
class Attack extends Objective{
  constructor(x,y){
    super(x,y)
    this.action = commands.ATTACK
  }
}
