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
    this.createFactoryButtons.call(this)

    this.slowUnits = 0
    this.fastUnits = 0
    this.team = 0



    console.log(this);

  }

  updateMenu(focus){
    console.log("MENU UPDATE", focus);
  }

  createFactoryButtons(){
    var textStyle = {
      fontSize: '32px',
      fontFamily: 'MS Gothic',
      color: '#ffffff',
      align: 'center',
      backgroundColor: '#ff00ff'
    }
    console.log(this.game.canvas.height);
    var activator = this.add.circle(0, this.game.canvas.height/2, 50, 0x6200EE).setDepth(10)


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
    var fuA = this.add.text(10, 130,"+", textStyle).setInteractive({useHandCursor:true}).on('pointerdown', () => {this.fastUnits++; fuC.setText(this.fastUnits)});
    var fuS = this.add.text(155,130,"-", textStyle).setInteractive({useHandCursor:true}).on('pointerdown', () => {this.fastUnits = this.fastUnits <= 0 ? this.fastUnits: this.fastUnits - 1; fuC.setText(this.fastUnits)});;
    var fuB = this.add.text(10, 90,"Fast Units", textStyle);
    var fuC = this.add.text(85, 130,"0", textStyle);
    var tsA = this.add.text(10, 210,"+", textStyle).setInteractive({useHandCursor:true}).on('pointerdown', () => {this.team++; tsC.setText(this.team)});
    var tsS = this.add.text(155,210,"-", textStyle).setInteractive({useHandCursor:true}).on('pointerdown', () => {this.team = this.team <= 0 ? this.team: this.team - 1; tsC.setText(this.team)});;
    var tsB = this.add.text(10, 170,"Team", textStyle);
    var tsC = this.add.text(85, 210,"0", textStyle);
    var cfB = this.add.text(50, 250, "Create", textStyle).setInteractive({useHandCursor:true}).on('pointerdown', () => {
      var units = []
      for(var i = 0; i < this.slowUnits; i++){
        units.push(this.gameScene.gameManager.factory.add.BaseUnit(this.gameScene, Math.random() * 1600, Math.random() * 800, 'red1',this.team));
      }
      for(var i = 0; i < this.fastUnits; i++){
        units.push(this.gameScene.gameManager.factory.add.BaseUnit(this.gameScene, Math.random() * 1600, Math.random() * 800, 'blue1',this.team));
      }
      var formation = this.gameScene.gameManager.factory.add.Formation(units)
      formation.flagship.setObjective(new Objective(Math.random() * 1600, Math.random() * 800, gametools.statics.commands.MOVE))
      setInterval((formation) => {
        formation.flagship.setObjective(new Objective(Math.random() * 1600, Math.random() * 800, gametools.statics.commands.MOVE))
      },
      12000,
      formation)
      formation.refresh()
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
