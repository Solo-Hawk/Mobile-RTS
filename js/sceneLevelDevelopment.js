class SceneLevelDevelopment extends Phaser.Scene{
  constructor(){
    super("level-development")
  }
  preload(){
    this.width = this.cameras.main.width;
    this.height = this.cameras.main.height;

    console.log(this);
    var percentText = this.make.text({
        x: this.width / 2,
        y: 20,
        text: 'Game Scene',
        style: {
            font: '18px monospace',
            fill: '#ffffff'
        }
    });
    percentText.setOrigin(0.5, 0.5);

    this.rts ={
      units:{

      }
    }

  }
  create(){
    this.debugLayer = this.make.graphics({},true)
    this.debugLayer.depth = 5
    this.matter.world.debugGraphic = this.debugLayer
    this.rts.units.main = new Steerable(this, this.width/2, this.height/4, 'red1')
    this.rts.units.target = new Steerable(this, this.width/3, this.height/1.5, 'blue1')
    // var steerable = this.add.sprite(this.width/2, this.height/2, 'red1')
    // this.rts.units.main.setTarget(this.rts.units.target)
    console.log(this.steerable);
    this.rts.units.main.setMoveMode(steeringSys.SEEK)
    this.rts.units.main.setTarget(this.rts.units.target)
    console.log(this.rts.units.main);
  }
  update(){

    this.rts.units.main.update();
    this.rts.units.target.update();
    // this.rts.units.target.update();
  }
}
