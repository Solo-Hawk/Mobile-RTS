class GameInterface extends Phaser.Scene{
  constructor(){
    super("game-interface")
  }
  init(gameScene){
      this.gameScene = gameScene
      console.log("Init");
      console.log(gameScene);
  }

  preload(){

  }
  create(){
    this.createButtons.call(this)

    this.slowUnits = 0
    this.fastUnits = 0



    console.log(this);

  }

  createButtons(){
    var textStyle = {
      fontSize: '32px',
      fontFamily: 'MS Gothic',
      color: '#ffffff',
      align: 'center',
      backgroundColor: '#ff00ff'
    }
    var suA = this.add.text(10, 50 ,"+", textStyle).setInteractive({useHandCursor:true}).on('pointerdown', () => {this.slowUnits++; suC.setText(this.slowUnits)});
    var suS = this.add.text(155,50 ,"-", textStyle).setInteractive({useHandCursor:true}).on('pointerdown', () => {this.slowUnits = this.slowUnits <= 0 ? this.slowUnits: this.slowUnits - 1; suC.setText(this.slowUnits)});
    var suB = this.add.text(10, 10,"Slow Units", textStyle);
    var suC = this.add.text(85, 50,"0" , textStyle)
    var fuA = this.add.text(10, 130,"+", textStyle).setInteractive({useHandCursor:true}).on('pointerdown', () => {this.fastUnits++; fuC.setText(this.fastUnits)});;
    var fuS = this.add.text(155,130,"-", textStyle).setInteractive({useHandCursor:true}).on('pointerdown', () => {this.fastUnits = this.fastUnits <= 0 ? this.fastUnits: this.fastUnits - 1; fuC.setText(this.fastUnits)});;
    var fuB = this.add.text(10, 90,"Fast Units", textStyle);
    var fuC = this.add.text(85, 130,"0", textStyle);
    var cfB = this.add.text(50, 170, "Create", textStyle).setInteractive({useHandCursor:true}).on('pointerdown', () => {
      var units = []
      for(var i = 0; i < this.slowUnits; i++){
        units.push(this.gameScene.gameManager.add.unit.SlowUnit(this.gameScene, Math.random() * 1600, Math.random() * 800, 'red1'));
      }
      for(var i = 0; i < this.fastUnits; i++){
        units.push(this.gameScene.gameManager.add.unit.FastUnit(this.gameScene, Math.random() * 1600, Math.random() * 800, 'blue1'));
      }
      var formation = this.gameScene.gameManager.add.formation.Formation(this.gameScene, units)
      formation.setObjective(new MoveTo(Math.random() * 1600, Math.random() * 800))
      setInterval((formation) => {
        formation.setObjective(new MoveTo(Math.random() * 1600, Math.random() * 800))
      },
      12000,
      formation)
    })
    // var fuA = this.add.text(10,50,"+",textStyle );
    // var fuS = this.add.text(210,50,"-",textStyle );
    // var fuB = this.add.text(40,50,"Fast Units",textStyle );
    // var cfB = this.add.text(10,10,"+",textStyle );



    // this.buttons = {}
    // this.buttons.createUnit = this.newLabeledButton("Create Unit",140,40,240,40)
    // this.buttons.createUnit.body.setInteractive({useHandCursor:true})
    // .on('pointerover', () => {this.buttons.createUnit.body.setFillStyle(0x3700B3);})
    // .on('pointerout', () => {this.buttons.createUnit.body.setFillStyle(0x6200EE);})
    // .on('pointerdown', () => {this.gameManager.add.unit.FastUnit(this, Math.random() * 1600, Math.random() * 800, 'blue1');})
    // .on('pointerup', () => {this.buttons.createUnit.body.setFillStyle(0x3700B3);});
    //
    // this.buttons.createForm = this.newLabeledButton("Create Formation",140,100,240,40)
    // this.buttons.createForm.body.setInteractive({useHandCursor:true})
    // .on('pointerover', () => {this.buttons.createForm.body.setFillStyle(0x3700B3);})
    // .on('pointerout', () => {this.buttons.createForm.body.setFillStyle(0x6200EE);})
    // .on('pointerdown', () => {
    //   var units = []
    //   units[0] = this.gameScene.gameManager.add.unit.FastUnit(this.gameScene, Math.random() * 1600, Math.random() * 800, 'blue1')
    //   units[1] = this.gameScene.gameManager.add.unit.FastUnit(this.gameScene, Math.random() * 1600, Math.random() * 800, 'blue1')
    //   units[2] = this.gameScene.gameManager.add.unit.FastUnit(this.gameScene, Math.random() * 1600, Math.random() * 800, 'blue1')
    //   units[3] = this.gameScene.gameManager.add.unit.SlowUnit(this.gameScene, Math.random() * 1600, Math.random() * 800, 'red1')
    //   units[4] = this.gameScene.gameManager.add.unit.FastUnit(this.gameScene, Math.random() * 1600, Math.random() * 800, 'blue1')
    //   units[5] = this.gameScene.gameManager.add.unit.FastUnit(this.gameScene, Math.random() * 1600, Math.random() * 800, 'blue1')
    //
    //   var formation = this.gameScene.gameManager.add.formation.Formation(this.gameScene,units)
    //   console.log(this);
    //   formation.setObjective(new MoveTo(Math.random() * 1600, Math.random() * 800))
    //   setInterval((formation) => {
    //     formation.setObjective(new MoveTo(Math.random() * 1600, Math.random() * 800))
    //
    //   },12000,
    //   formation)
    // })
    //
    // .on('pointerup', () => {this.buttons.createForm.body.setFillStyle(0x3700B3);});
    // console.log(this);
  }

  newLabeledButton(text,x,y,w,h){
    var button = {}
    button.body = this.add.rectangle(x , y, w, h, 0x6200EE)
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
}
