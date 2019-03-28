class GameManager{
  constructor(gameScene, userInterface){
    console.log(gameScene, userInterface);
    this.gameScene = gameScene
    this.userInterface = userInterface
    this.factoryManager = new FactoryManager(this)
    this.units = []
    this.formations = []
    this.homes = []
    this.teams = []

  }
  create(){
    this.worldField = this.gameScene.add.rectangle(0, 0, config.width*4, config.height*4, 0x444444,1).setDepth(-1)
  }
  update(delta,time){
    this.trashCompactor()

  }



  // Remove any formation that have no units left alive
  // Remove any units that are dead and eject it from given formation
  trashCompactor(){

  }
}
