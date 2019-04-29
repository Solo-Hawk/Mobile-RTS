 class SceneMenu extends Phaser.Scene{
  constructor(){
    super("mainmenu")


    console.log("Const MainMenu")
  }
  preload(){
    this.width = this.cameras.main.width;
    this.height = this.cameras.main.height;


    console.log("Preload MainMenu")

    var loadingText = this.make.text({
        x: this.width / 2,
        y: this.height / 2 - 100,
        text: 'Mobile - RTS',
        style: {
            font: '32px monospace',
            fill: '#ffffff'
        }
    });
    loadingText.setOrigin(0.5, 0.5);

  }

  newLabeledButton(text){
    var button = {}
    button.body = this.add.rectangle(this.width / 2, this.height / 2, 200, 40, 0x6200EE)
    button.body.setOrigin(0.5,0.5)
    button.text = this.make.text({
        x: this.width / 2,
        y: this.height / 2,
        text: text,
        style: {
            font: '26px Verdana',
            fill: '#ffffff'
        }
    }).setDepth(4).setOrigin(0.5,0.5)
    return button
  }

  create(){

    console.log("Create MainMenu")

    this.buttons = {}

    this.buttons.newGame = this.newLabeledButton("New Game")
    this.buttons.newGame.body
      .setInteractive({useHandCursor:true})
      .on('pointerover', () => {this.buttons.newGame.body.setFillStyle(0x3700B3);})
      .on('pointerout', () => {this.buttons.newGame.body.setFillStyle(0x6200EE);} )
      .on('pointerdown', () => {/*this.scale.startFullscreen();*/this.scale.scaleMode = Phaser.Scale.FIT;this.scene.switch("level-development");} )
      .on('pointerup', () => {this.buttons.newGame.body.setFillStyle(0x3700B3);}
    );


  }
  update(){

  }
}
