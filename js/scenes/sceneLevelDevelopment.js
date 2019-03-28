class SceneLevelDevelopment extends Phaser.Scene{
  constructor(){
    super("level-development")
  }
  preload(){
    this.scene.run("game-interface")
    this.userInterface = this.scene.get("game-interface")
    this.gameManager = new GameManager(this, this.userInterface)
  }
  create(){
    this.gameManager.create()

    var unit = new Interactable(this.gameManager, this, 0,0, "1Heavy", "unit")
    this.gameCamera = this.cameras.main
    this.gameCamera.setScroll(-config.width/2,-config.height/2)

    console.log(this.gameCamera);

  }


  update(delta,time){
    this.gameManager.update(delta,time)
  }


}
