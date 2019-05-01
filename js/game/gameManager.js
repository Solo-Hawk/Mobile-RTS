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
  }
  update(){
    console.log(this.formations);
    console.log(this.player.formations);
    console.log(this.comp.formations);

    this.player.formations.forEach((formation)=>{
        formation.update()
        console.log(formation.ships.length);
        console.log(formation.ships.length == 0);
        if(formation.ships.length == 0){
          this.player.formations = Game.Utils.arrayRemove(this.player.formations, formation)
          this.formations = Game.Utils.arrayRemove(this.formations, formation)
        }
    },this)
    this.comp.formations.forEach((formation)=>{
      formation.update()
      if(formation.ships.length == 0){
        this.comp.formations = Game.Utils.arrayRemove(this.comp.formations, formation)
        this.formations = Game.Utils.arrayRemove(this.formations, formation)
      }
    },this)

    console.log(this.formations);
    console.log(this.player.formations);
    console.log(this.comp.formations);

    this.ships.forEach((ship)=>{
      ship.update()
    })
    this.projectiles.forEach((projectile)=>{
      projectile.update()
    })
    if(this.ships.length > (this.player.length + this.comp.length)){
      this.sort()
    }
  }
  sort(){
    this.ships.forEach((ship)=>{
      switch (ship.team) {
        case Game.Utils.statics.teams.PLAYER:
          if(this.player.ships.indexOf(ship) == -1){
            this.player.ships.push(ship)
          }
          break;
        case Game.Utils.statics.teams.COMPUTER:
          if(this.comp.ships.indexOf(ship) == -1){
            this.comp.ships.push(ship)
          }
          break;


      }
    }, this)
    this.formations.forEach((formation)=>{
      switch (formation.team) {
        case Game.Utils.statics.teams.PLAYER:
          if(this.player.formations.indexOf(formation) == -1){
            this.player.formations.push(formation)
          }
          break;
        case Game.Utils.statics.teams.COMPUTER:
          if(this.comp.formations.indexOf(formation) == -1){
            this.comp.formations.push(formation)
          }
          break;


      }
    }, this)
  }
  getNearestTarget(formation){
    if(formation.ships.length == 0)return
    if(formation.flagship == Game.Utils.statics.BLANK)formation.findFlagship()
    console.log(formation);
    var formationList = formation.team == Game.Utils.statics.teams.PLAYER ? this.getComputerFormations() : this.getPlayerFormations()
    if(formationList[0] == this.comp.base || formationList[0] == this.player.formations)return formationList[0];
    console.log(formationList);
    var fs = formation.flagship
    console.log(fs);
    var closestFormation;
    var closestDistance;
    formationList.forEach((formation)=>{
      if(formation.flagship != Game.Utils.statics.BLANK){
        console.log(formation);
        console.log(fs);
        var distance = fs.distanceFrom(formation.flagship)
        console.log(distance);
        console.log(closestDistance);
        console.log(distance < closestDistance);
        if(closestDistance){
          if(distance < closestDistance){
            closestFormation = formation
            closestDistance = distance
          }
        }else{
          console.log("Force Setting Formation");
          closestFormation = formation
          closestDistance   = distance
        }
      }
    })
    return closestFormation

  }
  getComputerFormations(){
    return this.comp.formations
  }
  getPlayerFormations(){
    return this.player.formations
  }
}

class Factory{
  constructor(scene, manager){
    this.scene = scene
    this.manager = manager
  }
  formation(team, ships){
    if(team == Game.Utils.statics.teams.NEUTRAL)return;
    ships = ships || []
    var f = new Formation(this.manager, team, ships)
    this.manager.formations.push(f)
    this.manager.sort()
    return f
  }
  lightFighter(team, formation){
    if(team == Game.Utils.statics.teams.NEUTRAL){console.log("No Team"); return}
    var spawnPos = this.getSpawn(team)
    var s = new Fighter(this.scene, spawnPos.x, spawnPos.y, 'light-fighter-'+this.getColor(team), team)
    s.rating = 10
    s.addAttachment(new Gun(s,'missle-red',0,0))
    if(formation){
      formation.addUnit(s)
    }
    this.manager.ships.push(s)
    this.manager.sort()
    return s
  }
  playerBaseNode(x ,y){
    this.manager.player.base = new BaseNode(this.scene,x,y,'home-base-'+this.getColor(Game.Utils.statics.teams.PLAYER), Game.Utils.statics.teams.PLAYER, 600, 0)
  }
  computerBaseNode(x ,y){
    this.manager.comp.base = new BaseNode(this.scene,x,y,'home-base-'+this.getColor(Game.Utils.statics.teams.COMPUTER), Game.Utils.statics.teams.COMPUTER, -600, 0)
  }

  makeInteractable(){

  }
  getSpawn(team){
    return team == Game.Utils.statics.teams.PLAYER? this.manager.player.base.getSpawnPoint() : this.manager.comp.base.getSpawnPoint()
  }
  getColor(team){
    return team == Game.Utils.statics.teams.PLAYER? 'blue' : 'red'
  }
}
