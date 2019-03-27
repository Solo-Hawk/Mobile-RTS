class GameManager{
  constructor(gameScene, userInteface){
    console.log(gameScene, userInteface);
    this.gameScene = gameScene
    this.userInteface = userInteface
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
