class SceneTutorial extends Phaser.Scene{
  constructor(){
    super("tutorial")


    console.log("Const MainMenu")
  }
  preload(){
    this.width = this.cameras.main.width;
    this.height = this.cameras.main.height;


    console.log("Preload MainMenu")

    var loadingText = this.make.text({
        x: this.width / 2,
        y: this.height / 2 - 100,
        text: 'Space RTS \n \n You are Blue \n \n Build formations using the build button, Launch using the launch button \n \n Tier 1 - Fighters - Cheap Expendable Units \n    Light - Anti Heavy Fighter | Heavy - Anti Frigate  \n\n Tier 2 - Frigates - Armoured Counter Units \n    Swatter - Anti Fighter     | Bastion - Anti Frigate | Slammer - Anti Cruiser \n \n Tier 3 - Cruisers - Heavy Units | Super Anti Swarn or Anti Frigates \n    Leviathan - Anti Fighter   | Hunter - Anti Frigate / Cruisers \n \n The computer will slowly get more and more powerful \n \n Plan your formations and always keep money for last minute counters \n \n When you base health = 0 you lose' ,
        style: {
            font: '32px monospace',
            fill: '#ffffff'
        }
    });
    loadingText.setOrigin(0.5, 0.5);

  }

  newLabeledButton(text, x, y){
    var button = {}
    button.body = this.add.rectangle(x, y, 200, 40, 0x6200EE)
    button.body.setOrigin(0.5,0.5)
    button.text = this.make.text({
        x: x,
        y: y,
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

    this.buttons.back = this.newLabeledButton("Back", config.width/2, config.height/2 + config.height/4)
    this.buttons.back.body
      .setInteractive({useHandCursor:true})
      .on('pointerover', () => {this.buttons.back.body.setFillStyle(0x3700B3);})
      .on('pointerout', () => {this.buttons.back.body.setFillStyle(0x6200EE);} )
      .on('pointerdown', () => {this.scene.switch("mainmenu");} )
      .on('pointerup', () => {this.buttons.back.body.setFillStyle(0x3700B3);});

  }
  update(){

  }
}
