class SceneLevelDevelopment extends Phaser.Scene{
  constructor(){
    super("level-development")
  }
  preload(){

  }
  create(){
    this.scene.run("game-interface")
    this.userInteface = this.scene.get("game-interface")
    this.gameManager = new GameManager(this, this.userInteface)
    this.worldField = this.add.rectangle(config.width/2, config.height/2, config.width, config.height, 0x444444,1).setDepth(-1)
    var unit = new Interactable(this.gameManager, this, 700,282, "1Heavy", "unit")


  }


  update(delta,time){

  }


}
