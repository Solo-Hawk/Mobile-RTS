class GameManager {
  constructor(scene) {
    this.scene = scene
    this.running = true
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


    this.explosions = this.scene.add.group({
      defaultKey: 'smoke',
      maxSize: 50
    })
    console.log(this.explosions);
  }

  makeListeners(){
    this.scene.events.on('missle-destroy',this.createExplosion,this)
    this.scene.events.on('base-destroy',this.gameOver,this)
    // console.log(this.scene.events.eventNames());
  }

  gameOver(team){
    console.log("GAME OVER");
    this.running = false
    this.scene.impact.world.pause()
  }

  createExplosion(position){
    var explosion = this.explosions.get(position.x, position.y)
    explosion.setDepth(10);
    explosion.setActive(true);
    explosion.setVisible(true);
    explosion.setScale(2)
    explosion.on('animationcomplete', (animation, frame, gameObject)=>{

      gameObject.setActive(false);
      gameObject.setVisible(false);
    }, this);
    explosion.play('explode')
  }
  update(){
    if (!this.running) {
      return
    }
    // console.log(this.formations);
    // console.log(this.player.formations);
    // console.log(this.comp.formations);

    this.player.formations.forEach((formation)=>{
        formation.update()
        // console.log(formation.ships.length);
        // console.log(formation.ships.length == 0);
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

    // console.log(this.formations);
    // console.log(this.player.formations);
    // console.log(this.comp.formations);

    this.ships.forEach((ship)=>{
      ship.update()
      if(!ship.alive){
        ship.disconnect()
        this.ships = Game.Utils.arrayRemove(this.ships, ship)

        if(ship.team == Game.Utils.statics.teams.PLAYER){
          this.player.ships = Game.Utils.arrayRemove(this.player.ships, ship)
        }else if(ship.team == Game.Utils.statics.teams.COMPUTER){
          this.comp.ships = Game.Utils.arrayRemove(this.comp.ships, ship)
        }
        ship.destroy()

      }
    })
    this.projectiles.forEach((projectile)=>{
      if(!projectile.alive){
        projectile.destroy()
        this.projectiles = Game.Utils.arrayRemove(this.projectiles, projectile)
      }
      projectile.update()
    })
    if(this.ships.length > (this.player.length + this.comp.length)){
      this.sort()
    }
    this.player.base.update()
    this.comp.base.update()
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
    // console.log(formation);
    var formationList = formation.team == Game.Utils.statics.teams.PLAYER ? this.getComputerFormations() : this.getPlayerFormations()
    if(formationList[0] == this.comp.base || formationList[0] == this.player.formations)return formationList[0];
    // console.log(formationList);
    var fs = formation.flagship
    // console.log(fs);
    var closestFormation;
    var closestDistance;
    formationList.forEach((formation)=>{
      if(formation.flagship != Game.Utils.statics.BLANK){
        // console.log(formation);
        // console.log(fs);
        var distance = fs.distanceFrom(formation.flagship)
        // console.log(distance);
        // console.log(closestDistance);
        // console.log(distance < closestDistance);
        if(closestDistance){
          if(distance < closestDistance){
            closestFormation = formation
            closestDistance = distance
          }
        }else{
          // console.log("Force Setting Formation");
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
    s.health = 80 * 10
    s.maxLinearSpeed = 6000
    s.maxLinearAcceleration = 400
    s.ranges = {
      attackRange : 3000,
      evadeRange  : 200,
      returnRange : 3000,
      engageRange : 7000
    }
    s.addAttachment(new Gun(s,'missle-red',0,0))
    if(formation){
      formation.addUnit(s)
    }
    this.manager.ships.push(s)
    this.manager.sort()
    return s
  }
  heavyFighter(team, formation){
    if(team == Game.Utils.statics.teams.NEUTRAL){console.log("No Team"); return}
    var spawnPos = this.getSpawn(team)
    var s = new Fighter(this.scene, spawnPos.x, spawnPos.y, 'heavy-fighter-'+this.getColor(team), team)
    s.rating = 30
    s.health = 260 * 10
    s.maxLinearSpeed = 4800
    s.maxLinearAcceleration = 350
    s.ranges = {
      attackRange : 4000,
      evadeRange  : 200,
      returnRange : 3000,
      engageRange : 7000
    }
    s.setScale(2)
    s.addAttachment(new MissleLauncher(s,'missle-red',0,0,150,2,3000,8000, 140, 700,80,1.4))
    if(formation){
      formation.addUnit(s)
    }
    this.manager.ships.push(s)
    this.manager.sort()
    return s
  }
  swatterFrigate(team, formation){
    if(team == Game.Utils.statics.teams.NEUTRAL){console.log("No Team"); return}
    var spawnPos = this.getSpawn(team)
    var s = new Frigate(this.scene, spawnPos.x, spawnPos.y, 'swatter-frigate-'+this.getColor(team), team)
    s.rating = 140
    s.health = 600 * 10
    s.maxLinearSpeed = 3000
    s.maxLinearAcceleration = 20
    s.ranges = {
      idleRange:3500,
      maintainRange:4000,
      engageRange: 6000
    }
    s.setScale(3.5)
    s.addAttachment(new Turret(s,'turret-01',0,70).setScale(1))
    s.addAttachment(new Turret(s,'turret-01',0,-70).setScale(1))
    if(formation){
      formation.addUnit(s)
    }
    this.manager.ships.push(s)
    this.manager.sort()
    return s
  }
  bastionFrigate(team, formation){
    if(team == Game.Utils.statics.teams.NEUTRAL){console.log("No Team"); return}
    var spawnPos = this.getSpawn(team)
    var s = new Frigate(this.scene, spawnPos.x, spawnPos.y, 'bastion-frigate-'+this.getColor(team), team)
    s.rating = 300
    s.health = 1800 * 10
    s.maxLinearSpeed = 2200
    s.maxLinearAcceleration = 12
    s.ranges = {
      idleRange: 6000,
      maintainRange:7000,
      engageRange: 9000
    }
    s.setScale(2)
    s.addAttachment(new HeavyTurret(s,'turret-01',300).setScale(3))
    s.addAttachment(new HeavyTurret(s,'turret-01',-300).setScale(3))
    s.addAttachment(new SmartMissleLauncher(s,'missle-red',0,0,50,6,10000,16000, 300, 1400,120,3))
    if(formation){
      formation.addUnit(s)
    }
    this.manager.ships.push(s)
    this.manager.sort()
    return s
  }
  slammerFrigate(team, formation){
    if(team == Game.Utils.statics.teams.NEUTRAL){console.log("No Team"); return}
    var spawnPos = this.getSpawn(team)
    var s = new Frigate(this.scene, spawnPos.x, spawnPos.y, 'slammer-frigate-'+this.getColor(team), team)
    s.rating = 350
    s.health = 1800 * 10
    s.maxLinearSpeed = 2200
    s.maxLinearAcceleration = 12
    s.ranges = {
      idleRange: 4000,
      maintainRange:6000,
      engageRange: 7000
    }
    s.setScale(2)

    s.addAttachment(new Turret(s,'turret-01',300,0).setScale(2))
    s.addAttachment(new SuperTurret(s,'turret-01',-250,200).setScale(5))
    s.addAttachment(new SuperTurret(s,'turret-01',-250,-200).setScale(5))
    // s.addAttachment(new SmartMissleLauncher(s,'missle-red',0,0,50,30,10000,16000, 300, 1400,400,3))
    if(formation){
      formation.addUnit(s)
    }
    this.manager.ships.push(s)
    this.manager.sort()
    return s
  }
  leviathanCruiser(team, formation){
    if(team == Game.Utils.statics.teams.NEUTRAL){console.log("No Team"); return}
    var spawnPos = this.getSpawn(team)
    var s = new Frigate(this.scene, spawnPos.x, spawnPos.y, 'leviathan-cruiser-'+this.getColor(team), team)
    s.rating = 600
    s.health = 6500 * 10
    s.maxLinearSpeed = 2200
    s.maxLinearAcceleration = 12
    s.ranges = {
      idleRange:1200,
      maintainRange:2000,
      engageRange: 3000
    }
    s.setScale(6)

    s.addAttachment(new Turret(s,'turret-01',100,200).setScale(2))
    s.addAttachment(new Turret(s,'turret-01',-300,200).setScale(2))
    s.addAttachment(new Turret(s,'turret-01',100,-200).setScale(2))
    s.addAttachment(new Turret(s,'turret-01',-300,-200).setScale(2))
    s.addAttachment(new SmartMissleLauncherV2(s,'missle-red',0,0,300,12,3000,21000, 240, 2000,5,3))
    // s.addAttachment(new SmartMissleLauncher(s,'missle-red',0,0,50,30,10000,16000, 300, 1400,400,3))
    if(formation){
      formation.addUnit(s)
    }
    this.manager.ships.push(s)
    this.manager.sort()
    return s
  }
  hunterCruiser(team, formation){
    if(team == Game.Utils.statics.teams.NEUTRAL){console.log("No Team"); return}
    var spawnPos = this.getSpawn(team)
    var s = new Frigate(this.scene, spawnPos.x, spawnPos.y, 'hunter-cruiser-'+this.getColor(team), team)
    s.rating = 900
    s.health = 4000 * 10
    s.maxLinearSpeed = 2200
    s.maxLinearAcceleration = 12
    s.ranges = {
      idleRange:12000,
      maintainRange:14000,
      engageRange: 15000
    }
    s.setScale(6)

    s.addAttachment(new MegaGun(s,'turret-01',-250,0).setScale(10))
    // s.addAttachment(new SmartMissleLauncher(s,'missle-red',0,0,50,30,10000,16000, 300, 1400,400,3))
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
