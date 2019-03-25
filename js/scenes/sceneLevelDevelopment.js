class SceneLevelDevelopment extends Phaser.Scene{
  constructor(){
    super("level-development")
  }
  preload(){

  }
  create(){
    this.scene.run("game-interface")
    this.interface = this.scene.get("game-interface")

  }


  update(delta,time){

  }


}
