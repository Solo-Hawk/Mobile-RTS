class SceneLevelDevelopment extends Phaser.Scene{
  constructor(){
    super("level-development")
  }
  preload(){
    this.gameManager = new GameManager(this)

  }
  create(){
    console.log("CREATED HERE");
    this.units = {
      test:{
      }
    }
    // this.units.test.first = this.gameManager.create.lightFighter(Game.Utils.statics.teams.PLAYER, 500,800)
    // this.units.test.firstTarget = this.gameManager.create.lightFighter(Game.Utils.statics.teams.PLAYER, 700,200)
    // this.units.test.turret = this.gameManager.create.heavyFighter(Game.Utils.statics.teams.COMPUTER, 1500, 300)
    // this.units.test.turret.maxLinearSpeed = 1200;
    // this.units.test.turret.maxLinearAcceleration = 50;
    // this.units.test.turret.formation.setObjective(this.units.test.first)
    // console.log(this.units.test.turret.formation);
    // this.units.test.turret.addAttachment(new Turret(this.units.test.turret, 'missle-red'))
    // this.units.test.first.formation.setObjective(this.units.test.turret)
    // this.units.test.first.addAttachment(new Gun(this.units.test.first, 'missle-red',10,40))
    // setTimeout((scene)=>{
    //   scene.units.test.turret.formation.setObjective()
    //   console.log("Obj Changed");
    // },20000,this)
    var formation;
    for(var i = 0; i < 6; i++){
      var unit = this.gameManager.create.lightFighter(Game.Utils.statics.teams.PLAYER, Phaser.Math.Between(-8500, -6000),Phaser.Math.Between(-4000, 4000))
      this.gameManager.player[0].formation.addUnit(unit)
      unit.addAttachment(new Gun(unit, 'missle-red',0,0))
    }
    for(var i = 0; i < 6; i++){
      var unit = this.gameManager.create.lightFighter(Game.Utils.statics.teams.PLAYER, Phaser.Math.Between(-8500, -6000),Phaser.Math.Between(-4000, 4000))
      this.gameManager.player[0].formation.addUnit(unit)
      unit.addAttachment(new Gun(unit, 'missle-red',0,0))
    }
    for(var i = 0; i < 6; i++){
      var unit = this.gameManager.create.lightFighter(Game.Utils.statics.teams.PLAYER, Phaser.Math.Between(-8500, -6000),Phaser.Math.Between(-4000, 4000))
      this.gameManager.player[0].formation.addUnit(unit)
      unit.addAttachment(new Gun(unit, 'missle-red',0,0))
    }

    for(var i = 0; i < 6; i++){
      var unit = this.gameManager.create.lightFighter(Game.Utils.statics.teams.COMPUTER, Phaser.Math.Between(6000,8500),Phaser.Math.Between(-4000, 4000))
      this.gameManager.comp[0].formation.addUnit(unit)
      unit.addAttachment(new Gun(unit, 'missle-red',0,0))
    }
    for(var i = 0; i < 6; i++){
      var unit = this.gameManager.create.lightFighter(Game.Utils.statics.teams.COMPUTER, Phaser.Math.Between(6000,8500),Phaser.Math.Between(-4000, 4000))
      this.gameManager.comp[0].formation.addUnit(unit)
      unit.addAttachment(new Gun(unit, 'missle-red',0,0))
    }for(var i = 0; i < 6; i++){
      var unit = this.gameManager.create.lightFighter(Game.Utils.statics.teams.COMPUTER, Phaser.Math.Between(6000,8500),Phaser.Math.Between(-4000, 4000))
      this.gameManager.comp[0].formation.addUnit(unit)
      unit.addAttachment(new Gun(unit, 'missle-red',0,0))
    }
    this.gameManager.sort()

    for(var i = 0; i < this.gameManager.player.length; i++){
      this.gameManager.player[i].formation.setObjective(this.gameManager.comp[Phaser.Math.Between(0,this.gameManager.comp.length-1)])
    }
    for(var i = 0; i < this.gameManager.comp.length; i++){
      this.gameManager.comp[i].formation.setObjective(this.gameManager.player[Phaser.Math.Between(0,this.gameManager.player.length-1)])
    }
    var camera = this.cameras.getCamera("");

    camera.setZoom(0.24)
  }


  update(delta,time){
    this.gameManager.update()
  }


}
