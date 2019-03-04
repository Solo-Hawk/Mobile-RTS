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
        y: this.height / 2,
        text: 'Game Scene',
        style: {
            font: '18px monospace',
            fill: '#ffffff'
        }
    });
    percentText.setOrigin(0.5, 0.5);

  }
  create(){

  }
  update(){

  }
}
