class Formation{
  constructor(team, ships){
    this.team = team || Game.Utils.statics.teams.NEUTRAL;
    this.type = "formation"
    this.ships = ships || []
    this.flagship = Game.Utils.statics.BLANK
    this.target = Game.Utils.statics.BLANK;
    this.objective = Game.Utils.statics.BLANK;
  }

  update(){
    if(this.flagship == Game.Utils.statics.BLANK){
      this.findFlagship()
    }

    if(this.objective == Game.Utils.statics.BLANK){
      return
    }
    if(this.objective.command == Game.Utils.statics.BLANK || this.objective.command == Game.Utils.statics.commands.IDLE){
      return
    }
    switch (this.objective.command) {
      case Game.Utils.statics.commands.MOVE:
        break;
      case Game.Utils.statics.commands.ATTACK:
        this.ships.forEach((ship)=>{
          if(!ship.target.alive || ship.target == Game.Utils.statics.BLANK){
            ship.setTarget(this.objective.target.ships[Math.floor(Math.random() * this.objective.target.ships.length)])
          }
          ship.mode = Game.Utils.statics.commands.ATTACK
        })
        break;

    }


  }

  findFlagship(){
    console.log("finding FS");
    for(var i = 0; i < this.ships.length; i++){
      console.log(this.ships[i].rating);
      if(this.ships[i].rating > this.flagship.rating || this.flagship == Game.Utils.statics.BLANK){
        this.flagship = this.ships[i]
      }
    }
  }
  addUnit(unit){
    if(this.ships.indexOf(unit) == -1){
      unit.formation.removeUnit(unit)
      this.ships.push(unit)
      unit.formation = this
    }
  }
  removeUnit(unit){
    unit.formation = Game.Utils.statics.BLANK
    this.ships = Game.Utils.arrayRemove(this.ships, unit)
  }

  setObjective(target){
    console.log(target);
    target = target || Game.Utils.statics.BLANK
    if(target == Game.Utils.statics.BLANK){
      this.objective = Game.Utils.statics.BLANK
      return
    }
    console.log(target);
    switch (target.type) {
      case "vector2d":
        this.objective = new Objective(target, Game.Utils.statics.commands.MOVE);
        break;
      case "formation":
        this.objective = new Objective(target, Game.Utils.statics.commands.ATTACK)
        break;
      case "unit":
        this.objective = new Objective(target.formation, Game.Utils.statics.commands.ATTACK)
        break;
    }
    console.log(this.objective);

  }

}


class Objective{
  constructor(target, command){
    this.target = target;
    this.command = command || Game.Utils.statics.BLANK
  }
}
