class GameManager{
  constructor(gameScene, uiScene){
    console.log(gameScene, uiScene);
    this.gameScene = gameScene
    this.uiScene = uiScene
    this.units = []
    this.formations = []
    this.factory = {
      add: new class{
        constructor(){
          this.gameManager;
        }
        setManager(gameManager){
          this.gameManager = gameManager
        }
        Formation(units, leader, team){
          var formation = new Formation(this.gameManager, units, leader, team)
          this.gameManager.formations.push(formation)
          return formation
        }
        BaseUnit(scene, x, y, texture, team, formation, objective){
          console.log(scene);
          var u = new BaseUnit(this.gameManager, scene,x,y,texture,team, formation, objective)
          this.gameManager.units.push(u)
          return u
        }
      }
    }
    this.factory.add.setManager(this)
  }

  getNearestFormation(formation,distance){
    for(var i = 0; i < this.formations.length; i++){
      if(this.formations[i] != formation && this.formations[i] != formation.team){
        var length = formation.flagship.getPosition().subtract(this.formations[i].flagship.getPosition()).length()
        if(length <= distance){return this.formations[i]}
      }
    }
  }


  update(){
    this.formations.forEach((formation)=>{formation.refresh();formation.update()})
    this.units.forEach((unit)=>{unit.update()})
  }
}
