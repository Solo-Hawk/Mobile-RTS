class SceneLevelDevelopment extends Phaser.Scene{
  constructor(){
    super("level-development")
  }
  preload(){

  }
  create(){
    this.scene.add("game-interface",new GameInterface(), false, this)
    this.scene.run("game-interface")
    var gameInterface = this.scene.get("game-interface")
    this.gameManager = new GameManager(this, gameInterface)
    console.log(this);


  }


  update(delta,time){
    this.gameManager.update()

  }


}
