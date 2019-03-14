class GameManager{

  constructor(scene){
    this.scene = scene
    this.units = []
    this.formations = []
    this.add = {
      unit:new class{
        Steerable(scene, x, y, texture, frame, options){
          var s = new Steerable(scene, x, y, texture, frame, options)
          scene.gameManager.addUnits([s])
          return s
        }
        BaseUnit(scene, x, y, texture, frame, options){
          var u = new BaseUnit(scene, x, y, texture, frame, options)
          scene.gameManager.addUnits([u])
          return u
        }
        SlowUnit(scene, x, y, texture, frame, options){
          var u = new SlowUnit(scene, x, y, texture, frame, options)
          scene.gameManager.addUnits([u])
          return u
        }
        FastUnit(scene, x, y, texture, frame, options){
          var u = new FastUnit(scene, x, y, texture, frame, options)
          scene.gameManager.addUnits([u])
          return u
        }
      },
      formation: new class{
        Formation(scene, units){
          var f = new Formation(units)
          scene.gameManager.addFormation(f)
          return f
        }
      }
  }

  }

  createUnit(){

  }
  createFormation(){

  }
  addUnits(units){
    this.units = this.units.concat(units)
  }
  removeUnit(unit){
    if(unit.formation){
      unit.formation.removeUnit(unit)
    }
    this.units.splice(this.units.indexOf(unit),1)
  }
  createFormation(){

  }
  addFormation(formation){
    this.formations = this.formations.concat(formation)
  }
  getFormation(unit){

  }
  removeFormation(formation){

  }
  update(){
    this.formations.forEach((formation)=>{formation.update()})
    this.units.forEach((unit)=>{unit.update();})
  }

}
