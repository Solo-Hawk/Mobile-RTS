class SceneLevelDevelopment extends Phaser.Scene{
  constructor(){
    super("level-development")
  }
  preload(){
    this.gameManager = new GameManager(this)
    this.scene.add("game-interface",new GameInterface(), false, this)
    this.scene.run("game-interface")
    this.GameInterface = this.scene.get("game-interface")
    this.gameManager.makeListeners()
    this.impact.world.setBounds(-45000,-4000,90000,8000)


  }
  create(){
    console.log("CREATED HERE");


    this.mainCamera = this.cameras.getCamera("");
    this.mainCamera.setZoom(0.12)
    this.mainCamera.setBounds(-45000,-5000,90000,10000,true)
    this.cameraFrame = this.add.rectangle(this.mainCamera.scrollX + config.width/2, this.mainCamera.scrollY + config.height/2, this.mainCamera.width / 0.12, this.mainCamera.height/0.12, 0x0000ff, 0.2)

    this.cameraFrame.lineWidth = 3
    this.cameraFrame.strokeColor = 0x0000ff
    this.minimap = this.cameras.add(config.width/2 - 500 , 10, 1000, 80).setZoom(0.009).setName('mini');
    this.minimap.setBackgroundColor(0x002244);
    this.minimap.scrollX = 1600 - config.width/2;
    this.minimap.scrollY = 400;

    var formation1 = this.gameManager.create.formation(Game.Utils.statics.teams.PLAYER)
    var formation2 = this.gameManager.create.formation(Game.Utils.statics.teams.COMPUTER)
    var formation3 = this.gameManager.create.formation(Game.Utils.statics.teams.PLAYER)
    var formation4 = this.gameManager.create.formation(Game.Utils.statics.teams.COMPUTER)

    this.gameManager.create.playerBaseNode(-40000,500)
    this.gameManager.create.computerBaseNode(40000,500)

    for(var i = 0; i < 1; i++){
      setTimeout((scene)=>{
        var formation = scene.gameManager.create.formation(Game.Utils.statics.teams.PLAYER)
        scene.gameManager.create.lightFighter(Game.Utils.statics.teams.PLAYER,formation)
        scene.gameManager.create.lightFighter(Game.Utils.statics.teams.PLAYER,formation)
        scene.gameManager.create.lightFighter(Game.Utils.statics.teams.PLAYER,formation)
        scene.gameManager.create.lightFighter(Game.Utils.statics.teams.PLAYER,formation)
        scene.gameManager.create.lightFighter(Game.Utils.statics.teams.PLAYER,formation)
        scene.gameManager.create.lightFighter(Game.Utils.statics.teams.PLAYER,formation)
        scene.gameManager.create.heavyFighter(Game.Utils.statics.teams.PLAYER,formation)
        scene.gameManager.create.heavyFighter(Game.Utils.statics.teams.PLAYER,formation)
        scene.gameManager.create.heavyFighter(Game.Utils.statics.teams.PLAYER,formation)
        scene.gameManager.create.heavyFighter(Game.Utils.statics.teams.PLAYER,formation)
        scene.gameManager.create.heavyFighter(Game.Utils.statics.teams.PLAYER,formation)
        scene.gameManager.create.heavyFighter(Game.Utils.statics.teams.PLAYER,formation)
        scene.gameManager.create.heavyFighter(Game.Utils.statics.teams.PLAYER,formation)
        scene.gameManager.create.heavyFighter(Game.Utils.statics.teams.PLAYER,formation)
        scene.gameManager.create.heavyFighter(Game.Utils.statics.teams.PLAYER,formation)
        scene.gameManager.create.heavyFighter(Game.Utils.statics.teams.PLAYER,formation)
        scene.gameManager.create.heavyFighter(Game.Utils.statics.teams.PLAYER,formation)
        scene.gameManager.create.swatterFrigate(Game.Utils.statics.teams.PLAYER,formation)
        scene.gameManager.create.swatterFrigate(Game.Utils.statics.teams.PLAYER,formation)
        scene.gameManager.create.swatterFrigate(Game.Utils.statics.teams.PLAYER,formation)
        scene.gameManager.create.leviathanCruiser(Game.Utils.statics.teams.PLAYER,formation)


        formation.findFlagship()
      },8000*i, this)

    }
    for(var i = 0; i < 1; i++){
      setTimeout((scene)=>{
        var formation = scene.gameManager.create.formation(Game.Utils.statics.teams.COMPUTER)
        // scene.gameManager.create.heavyFighter(Game.Utils.statics.teams.COMPUTER,formation)
        // scene.gameManager.create.heavyFighter(Game.Utils.statics.teams.COMPUTER,formation)
        scene.gameManager.create.lightFighter(Game.Utils.statics.teams.COMPUTER,formation)
        scene.gameManager.create.lightFighter(Game.Utils.statics.teams.COMPUTER,formation)
        scene.gameManager.create.lightFighter(Game.Utils.statics.teams.COMPUTER,formation)
        scene.gameManager.create.lightFighter(Game.Utils.statics.teams.COMPUTER,formation)
        scene.gameManager.create.lightFighter(Game.Utils.statics.teams.COMPUTER,formation)
        scene.gameManager.create.lightFighter(Game.Utils.statics.teams.COMPUTER,formation)
        scene.gameManager.create.lightFighter(Game.Utils.statics.teams.COMPUTER,formation)
        scene.gameManager.create.lightFighter(Game.Utils.statics.teams.COMPUTER,formation)
        scene.gameManager.create.lightFighter(Game.Utils.statics.teams.COMPUTER,formation)
        scene.gameManager.create.lightFighter(Game.Utils.statics.teams.COMPUTER,formation)
        scene.gameManager.create.lightFighter(Game.Utils.statics.teams.COMPUTER,formation)
        scene.gameManager.create.lightFighter(Game.Utils.statics.teams.COMPUTER,formation)
        scene.gameManager.create.lightFighter(Game.Utils.statics.teams.COMPUTER,formation)
        scene.gameManager.create.lightFighter(Game.Utils.statics.teams.COMPUTER,formation)
        scene.gameManager.create.lightFighter(Game.Utils.statics.teams.COMPUTER,formation)
        scene.gameManager.create.lightFighter(Game.Utils.statics.teams.COMPUTER,formation)
        scene.gameManager.create.lightFighter(Game.Utils.statics.teams.COMPUTER,formation)
        scene.gameManager.create.lightFighter(Game.Utils.statics.teams.COMPUTER,formation)
        scene.gameManager.create.lightFighter(Game.Utils.statics.teams.COMPUTER,formation)
        scene.gameManager.create.lightFighter(Game.Utils.statics.teams.COMPUTER,formation)
        scene.gameManager.create.lightFighter(Game.Utils.statics.teams.COMPUTER,formation)
        scene.gameManager.create.lightFighter(Game.Utils.statics.teams.COMPUTER,formation)
        scene.gameManager.create.lightFighter(Game.Utils.statics.teams.COMPUTER,formation)
        scene.gameManager.create.lightFighter(Game.Utils.statics.teams.COMPUTER,formation)
        scene.gameManager.create.lightFighter(Game.Utils.statics.teams.COMPUTER,formation)
        scene.gameManager.create.lightFighter(Game.Utils.statics.teams.COMPUTER,formation)
        scene.gameManager.create.lightFighter(Game.Utils.statics.teams.COMPUTER,formation)
        scene.gameManager.create.lightFighter(Game.Utils.statics.teams.COMPUTER,formation)
        scene.gameManager.create.lightFighter(Game.Utils.statics.teams.COMPUTER,formation)
        scene.gameManager.create.heavyFighter(Game.Utils.statics.teams.COMPUTER,formation)
        scene.gameManager.create.heavyFighter(Game.Utils.statics.teams.COMPUTER,formation)
        scene.gameManager.create.heavyFighter(Game.Utils.statics.teams.COMPUTER,formation)
        scene.gameManager.create.heavyFighter(Game.Utils.statics.teams.COMPUTER,formation)
        scene.gameManager.create.bastionFrigate(Game.Utils.statics.teams.COMPUTER,formation)
        scene.gameManager.create.slammerFrigate(Game.Utils.statics.teams.COMPUTER,formation)
        scene.gameManager.create.hunterCruiser(Game.Utils.statics.teams.COMPUTER,formation)

        formation.findFlagship()
      },100+ (10000*i), this)
    }

    this.cursors = this.input.keyboard.createCursorKeys();

  }


  update(delta,time){
    // console.clear()
    if (this.cursors.left.isDown)
    {
        this.cameras.main.scrollX += - 300;
        console.log("left",this.cameras.main.scrollX);
    }
    else if (this.cursors.right.isDown)
    {
        this.cameras.main.scrollX += 300
        console.log("right",this.cameras.main.scrollX);
    }

    // console.clear();
    this.gameManager.update()
    // console.log(this.gameManager.formations.length);
    this.cameraFrame.x = this.cameras.main.scrollX + config.width/2
    this.cameraFrame.y = this.cameras.main.scrollY + config.height/2
  }


}
