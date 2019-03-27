class SceneLevelDevelopment extends Phaser.Scene{
  constructor(){
    super("level-development")
  }
  preload(){

  }
  create(){
    this.scene.run("game-interface")
    this.interface = this.scene.get("game-interface")
    this.worldField = this.add.rectangle(700, 282, 1400, 564, 0x008800,1).setDepth(-1)

  }


  update(delta,time){

  }


}
