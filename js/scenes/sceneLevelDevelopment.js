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


    var camera = this.cameras.getCamera("");

    camera.setZoom(0.36)
    var formation1 = this.gameManager.create.formation(Game.Utils.statics.teams.PLAYER)
    var formation2 = this.gameManager.create.formation(Game.Utils.statics.teams.COMPUTER)
    var formation3 = this.gameManager.create.formation(Game.Utils.statics.teams.PLAYER)
    var formation4 = this.gameManager.create.formation(Game.Utils.statics.teams.COMPUTER)

    this.gameManager.create.playerBaseNode(-5000,500)
    this.gameManager.create.computerBaseNode(8000,500)
    this.gameManager.create.lightFighter(Game.Utils.statics.teams.PLAYER,formation1)
    this.gameManager.create.lightFighter(Game.Utils.statics.teams.PLAYER,formation1)
    this.gameManager.create.lightFighter(Game.Utils.statics.teams.PLAYER,formation1)
    this.gameManager.create.lightFighter(Game.Utils.statics.teams.PLAYER,formation1)
    this.gameManager.create.lightFighter(Game.Utils.statics.teams.PLAYER,formation1)
    this.gameManager.create.lightFighter(Game.Utils.statics.teams.COMPUTER,formation2)
    this.gameManager.create.lightFighter(Game.Utils.statics.teams.COMPUTER,formation2)
    this.gameManager.create.lightFighter(Game.Utils.statics.teams.COMPUTER,formation3)
    this.gameManager.create.lightFighter(Game.Utils.statics.teams.COMPUTER,formation3)
    this.gameManager.create.lightFighter(Game.Utils.statics.teams.COMPUTER,formation3)
    this.gameManager.create.lightFighter(Game.Utils.statics.teams.COMPUTER,formation4)
    this.gameManager.create.lightFighter(Game.Utils.statics.teams.COMPUTER,formation4)
    this.gameManager.create.lightFighter(Game.Utils.statics.teams.PLAYER,formation3)
    this.gameManager.create.lightFighter(Game.Utils.statics.teams.PLAYER,formation3)
    formation1.findFlagship()
    formation2.findFlagship()
    formation3.findFlagship()
    formation4.findFlagship()

  }


  update(delta,time){
    console.clear();
    this.gameManager.update()
    console.log(this.gameManager.formations.length);

  }


}
