class SceneLevelDevelopment extends Phaser.Scene{
  constructor(){
    super("level-development")
  }
  preload(){
    this.gameManager = new GameManager(this)
    this.scene.add("game-interface",new GameInterface(), false, this)
    this.scene.run("game-interface")
    this.GameInterface = this.scene.get("game-interface")

  }
  create(){
    console.log("CREATED HERE");
    this.units = {
      test:{
      }
    }

    // var formation;
    // for(var i = 0; i < 3; i++){
    //   var unit = this.gameManager.create.lightFighter(Game.Utils.statics.teams.PLAYER, Phaser.Math.Between(-8500, -6000),Phaser.Math.Between(-4000, 4000))
    //   if(i == 0){
    //     formation = unit.formation
    //   }
    //   formation.addUnit(unit)
    //   unit.addAttachment(new Gun(unit, 'missle-red',0,0))
    // }
    // for(var i = 0; i < 10; i++){
    //   var unit = this.gameManager.create.lightFighter(Game.Utils.statics.teams.PLAYER, Phaser.Math.Between(-8500, -6000),Phaser.Math.Between(-4000, 4000))
    //   if(i == 0){
    //     formation = unit.formation
    //   }
    //   formation.addUnit(unit)
    //   unit.addAttachment(new Gun(unit, 'missle-red',0,0))
    // }
    // for(var i = 0; i < 5; i++){
    //   var unit = this.gameManager.create.lightFighter(Game.Utils.statics.teams.PLAYER, Phaser.Math.Between(-8500, -6000),Phaser.Math.Between(-4000, 4000))
    //   if(i == 0){
    //     formation = unit.formation
    //   }
    //   formation.addUnit(unit)
    //   unit.addAttachment(new Gun(unit, 'missle-red',0,0))
    // }
    //
    // for(var i = 0; i < 7; i++){
    //   var unit = this.gameManager.create.lightFighter(Game.Utils.statics.teams.COMPUTER, Phaser.Math.Between(6000,8500),Phaser.Math.Between(-4000, 4000))
    //   if(i == 0){
    //     formation = unit.formation
    //   }
    //   formation.addUnit(unit)
    //   unit.addAttachment(new Gun(unit, 'missle-red',0,0))
    // }
    // for(var i = 0; i < 6; i++){
    //   var unit = this.gameManager.create.lightFighter(Game.Utils.statics.teams.COMPUTER, Phaser.Math.Between(6000,8500),Phaser.Math.Between(-4000, 4000))
    //   if(i == 0){
    //     formation = unit.formation
    //   }
    //   formation.addUnit(unit)
    //   unit.addAttachment(new Gun(unit, 'missle-red',0,0))
    // }for(var i = 0; i < 5; i++){
    //   var unit = this.gameManager.create.lightFighter(Game.Utils.statics.teams.COMPUTER, Phaser.Math.Between(6000,8500),Phaser.Math.Between(-4000, 4000))
    //   if(i == 0){
    //     formation = unit.formation
    //   }
    //   formation.addUnit(unit)
    //   unit.addAttachment(new Gun(unit, 'missle-red',0,0))
    // }
    // this.gameManager.sort()
    //
    // for(var i = 0; i < this.gameManager.player.length; i++){
    //   this.gameManager.player[i].formation.setObjective(this.gameManager.comp[Phaser.Math.Between(0,this.gameManager.comp.length-1)])
    // }
    // for(var i = 0; i < this.gameManager.comp.length; i++){
    //   this.gameManager.comp[i].formation.setObjective(this.gameManager.player[Phaser.Math.Between(0,this.gameManager.player.length-1)])
    // }
    var camera = this.cameras.getCamera("");

    camera.setZoom(0.24)
  }


  update(delta,time){
    // console.clear();
    this.gameManager.update()
  }


}
