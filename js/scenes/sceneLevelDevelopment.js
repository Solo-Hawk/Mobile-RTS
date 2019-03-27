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
    this.worldField = this.add.rectangle(config.width/2, config.height/2, config.width, config.height, 0x008800,1).setDepth(-1)
    var unit = new Interactable(this.gameManager, this, 700,282, "1Heavy", "unit")

    this.scale.on('orientationchange', (orientation)=>{
      if(orientation === Phaser.Scale.LANDSCAPE){
        this.scale.startFullscreen();
        this.splash.setVisible(false);
      }
    }, this);
  }


  update(delta,time){

  }


}
