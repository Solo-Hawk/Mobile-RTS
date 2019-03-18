class GameManager{

  constructor(gameScene, gameInterface){
    this.units = []
    this.formation = []
  }


  update(){
    this.formations.forEach((formation)=>{formation.update()})
    this.units.forEach((unit)=>{unit.update();})
  }

}
