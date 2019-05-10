class GameManager {
  constructor(scene) {
    this.scene = scene
    this.ships = []
    this.player = {
      base: null,
      ships:[],
      formations:[]
    }
    this.comp = {
      base: null,
      ships:[],
      formations:[]
    }
    this.formations = []
    this.emitters = []
    this.projectiles = []
    this.create = new Factory(this.scene, this)
    this.tick = 0
  }
  update(){
    if(this.tick == 0){
      this.formations.forEach((formation)=>{
        formation.update()
        if(formation.ships.length == 0){
          this.formations = Game.Utils.arrayRemove(this.formations, formation)
        }
      },this)
    }
    this.ships.forEach((ship)=>{
      ship.update()
    })
    this.projectiles.forEach((projectile)=>{
      projectile.update()
    })
    if(this.ships.length > (this.player.length + this.comp.length)){
      this.sort()
    }
    this.tick++
    if(this.tick >= 5){
      this.tick = 0
    }
  }
  sort(){
    this.ships.forEach((ship)=>{
      switch (ship.team) {
        case Game.Utils.statics.teams.PLAYER:
          if(this.player.indexOf(ship) == -1){
            this.player.ships.push(ship)
          }
          break;
        case Game.Utils.statics.teams.COMPUTER:
          if(this.comp.indexOf(ship) == -1){
            this.comp.ships.push(ship)
          }
          break;


      }
    }, this)
    this.formations.forEach((ship)=>{
      switch (ship.team) {
        case Game.Utils.statics.teams.PLAYER:
          if(this.player.indexOf(ship) == -1){
            this.player.formations.push(ship)
          }
          break;
        case Game.Utils.statics.teams.COMPUTER:
          if(this.comp.indexOf(ship) == -1){
            this.comp.formations.push(ship)
          }
          break;


      }
    }, this)
  }

}

class Factory{
  constructor(scene, manager){
    this.scene = scene
    this.manager = manager
  }
  formation(team, ships){
    team = team || Game.Utils.statics.teams.NEUTRAL
    ships = ships || []
    var f = new Formation(this.manager, team, ships)
    this.manager.formations.push(f)
    return f
  }
  base(){

  }
  lightFighter(team,x,y){
    if(team == Game.Utils.statics.teams.NEUTRAL){console.log("No Team"); return}
    x = x || 0;
    y = y || 0;
    console.log(x,y);
    var s = new Fighter(this.scene, x, y, 'light-fighter-'+this.getColor(team), team)
    s.rating = 10
    this.manager.ships.push(s)
    this.manager.sort()
    return s
  }
  heavyFighter(team,x,y){
    if(team == Game.Utils.statics.teams.NEUTRAL){console.log("No Team"); return}
    x = x || 0;
    y = y || 0;
    var s = new Fighter(this.scene, x, y, 'heavy-fighter-'+this.getColor(team), team)
    s.rating = 30
    s.setScale(1.6)
    s.maxLinearSpeed = 1200
    s.maxLinearAcceleration = 50
    this.manager.ships.push(s)
    this.manager.sort()
    return s
  }
  fighterGun(ship){
    if(ship){

    }
  }
  missleLauncher(ship){
    if(ship){

    }

  }
  turret(ship){
    if(ship){

    }

  }

  getColor(team){
    return team == Game.Utils.statics.teams.PLAYER? 'blue' : 'red'
  }
}
