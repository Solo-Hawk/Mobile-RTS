class GameManager{
  constructor(gameScene, userInterface){
    console.log(gameScene, userInterface);
    this.gameScene = gameScene
    this.userInterface = userInterface
    this.units = []
    this.formations = []

  }
  update(){
    this.trashCompactor()

  }

  // Remove any formation that have no units left alive
  // Remove any units that are dead and eject it from given formation
  trashCompactor(){

  }
}
