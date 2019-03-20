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
    var camera = this.cameras.getCamera("")
        //Change camera settings
        camera.zoom =0.6;
    var units = []
    for(var i = 0; i < 1; i++){
      units.push(this.gameManager.factory.add.SlowUnit(this, -300, 300, 1+ "Heavy",1));
    }
    for(var i = 0; i < 3; i++){
      units.push(this.gameManager.factory.add.FastUnit(this, -300, 300, 1 + "Light",1));
    }
    var formation = this.gameManager.factory.add.Formation(units)
    formation.flagship.setObjective(new Objective(-100,300, gametools.statics.commands.MOVE))
    formation.refresh()
  }


  update(delta,time){
    this.gameManager.update()

  }


}
