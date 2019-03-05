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

  }
  create(){
    this.debugLayer = this.make.graphics({},true)
    this.debugLayer.depth = 5
    this.matter.world.debugGraphic = this.debugLayer

    this.steerable = new Steerable(this, this.width/4, this.height/4, 'red1')
    // var steerable = this.add.sprite(this.width/2, this.height/2, 'red1')
    console.log(this.steerable);
  }
  update(){
    this.steerable.update()
  }
}
