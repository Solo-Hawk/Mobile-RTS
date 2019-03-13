class SceneLevelDevelopment extends Phaser.Scene{
  constructor(){
    super("level-development")
  }
  preload(){

  }
  create(){
    this.units = UnitMaker.Steerable(this, 200, 300, 'red1')
    console.log(this.units);
    this.units.target = util.vector2d(400, 200)
  }
  update(){
    this.units.update()
  }
}
