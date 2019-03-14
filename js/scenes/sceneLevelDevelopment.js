class SceneLevelDevelopment extends Phaser.Scene{
  constructor(){
    super("level-development")
  }
  preload(){

  }
  create(){
    this.units = []
    this.units[0] = UnitMaker.SlowUnit(this, 200, 300, 'red1')
    this.units[1] = UnitMaker.BaseUnit(this, 200, 400, 'blue1')
    this.units[2] = UnitMaker.BaseUnit(this, 200, 400, 'red1')
    this.units[3] = UnitMaker.BaseUnit(this, 200, 400, 'blue1')
    console.log(this.units);

      this.formation = new Formation([this.units[0], this.units[1],this.units[2],this.units[3]])
      this.formation.setObjective(new MoveTo(Math.random() * 800, Math.random() * 400))
      setInterval((scene) => {scene.formation.setObjective(new MoveTo(Math.random() * 800, Math.random() * 400))},
      10000, 
      this)
  }
  update(delta,time){
    // console.log(time);
    this.formation.update()
    this.units[0].update()
    this.units[1].update()
    this.units[2].update()
    this.units[3].update()
  }
}
