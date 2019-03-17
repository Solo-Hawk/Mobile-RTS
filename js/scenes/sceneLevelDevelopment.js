class SceneLevelDevelopment extends Phaser.Scene{
  constructor(){
    super("level-development")
  }
  preload(){

  }
  create(){
    var gameInterface = this.scene.add("game-interface",new GameInterface(), false, this)
    this.scene.run("game-interface")

    this.gameManager = new GameManager(this, gameInterface)

    console.log(this);


  }


  update(delta,time){
    // console.log(time);
    this.gameManager.update()

  }


}
