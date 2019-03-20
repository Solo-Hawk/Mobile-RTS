class GameInterface extends Phaser.Scene{
  constructor(){
    super("game-interface")
  }
  init(gameScene){
      this.gameScene = gameScene
      console.log("Init");
      console.log(gameScene);
      this.focus = null
      this.focusReady = false
      this.elements = []
      this.components = []
      this.textStyle = {
        fontSize: '48px',
        fontFamily: 'MS Gothic',
        color: '#ffffff',
        align: 'center',
        backgroundColor: '#ff00ff'
      }
  }

  preload(){

  }
  create(){
    this.createButtons.call(this)
    this.createFactoryButtons.call(this)

    this.slowUnits = 1
    this.fastUnits = 1
    this.team = 1

    this.touchStartX;
    this.touchStartY;
    this.touchEndX;
    this.touchEndY;



    console.log(this);
    this.gameScene.input.on('pointerdown', function(pointer){
      console.log("POinter Down");
      this.touchStartX = pointer.x
      this.touchStartY = pointer.y
      if(this.focus.type != null && this.focus.type != undefined){
        if(this.focus.type == "formation"){
          console.log("Focus is formation");
        }
      }
    }, this)

    this.gameScene.input.on('pointerup', function(pointer){
      console.log("Pointer Up");
      this.touchEndX = pointer.x;
      this.touchEndY = pointer.y;

      var start = gametools.utils.vector.vector2d(this.touchStartX, this.touchStartY)
      var end = gametools.utils.vector.vector2d(this.touchEndX, this.touchEndY)
      var length = start.subtract(end).length()
      if(!this.focusReady) return
      if(this.focus.type != null && this.focus.type != undefined){
        if(this.focus.type == "formation"){
          console.log("Focus is formation");
          if(length < 20){
            this.focus.flagship.setObjective(new Objective(pointer.x, pointer.y, gametools.statics.commands.MOVE))
          }else{
            this.focus.flagship.linearVelocity.angleTo(start.toAngle() + Phaser.Math.DegToRad(180))
            this.focus.flagship.setObjective(new Objective(this.focus.flagship.position.x + this.focus.flagship.linearVelocity.x,
                                                           this.focus.flagship.position.y + this.focus.flagship.linearVelocity.y,
                                                           gametools.statics.commands.MOVE))
          }
        }
      }
    },this)

  }
  update(){
      if(this.focus != undefined && this.focus != null){this.focusReady = true}else{this.focusReady = false}
    this.elements.forEach((element)=>{element.destroy()})
    if(this.focus){
      if(this.focus.type == "formation"){
        var flagPos = this.focus.flagship.position
        var circle = this.gameScene.add.circle(flagPos.x, flagPos.y, 70, 0xffffff, 0).setDepth(100)
        circle.setOrigin(-0.1,-0.1)
        circle.setStrokeStyle(7, 0xffff00, 1)
        this.elements.push(circle)
        this.focus.children.forEach((unit)=>{
            var unitPos = unit.position
            var unitCircle = this.gameScene.add.circle(unitPos.x, unitPos.y, 50, 0xffffff, 0)
            unitCircle.setOrigin(-0.4,-0.4)
            unitCircle.setStrokeStyle(7, 0x00ff00, 1)
            this.elements.push(unitCircle)

        },this)

      }
    }


  }

  updateMenu(focus){
    this.focus = focus
    console.log("MENU UPDATE", focus);
    var button = this.add.text(1150, 10 ,"Deselect", this.textStyle)
    button.setInteractive({useHandCursor:true}).on('pointerdown', () => {this.clearComponents(); this.focus = undefined; button.destroy()});
    if(focus.type = "formation"){
      this.scene
      // this.createControlPanel(focus)
    }


  }
  clearComponents(){
    this.components.forEach((comp)=>{comp.destroy()})
  }
  createControlPanel(focus){
    var image = this.add.image(300, 720, this.focus.flagship.texture.key).setDepth(1000)
    var box = this.add.rectangle(800, 700, 1200, 200, 0xAA00FF)
  }

  createFactoryButtons(){
    // var textStyle = {
    //   fontSize: '32px',
    //   fontFamily: 'MS Gothic',
    //   color: '#ffffff',
    //   align: 'center',
    //   backgroundColor: '#ff00ff'
    // }
    // console.log(this.game.canvas.height);
    // var activator = this.add.circle(0, this.game.canvas.height/2, 50, 0x6200EE).setDepth(10)


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
    var suS = this.add.text(155,50 ,"-", textStyle).setInteractive({useHandCursor:true}).on('pointerdown', () => {this.slowUnits = this.slowUnits <= 1   ? this.slowUnits: this.slowUnits - 1; suC.setText(this.slowUnits)});
    var suB = this.add.text(10, 10,"Slow Units", textStyle);
    var suC = this.add.text(85, 50,"1" , textStyle)
    var fuA = this.add.text(10, 130,"+", textStyle).setInteractive({useHandCursor:true}).on('pointerdown', () => {this.fastUnits++; fuC.setText(this.fastUnits)});
    var fuS = this.add.text(155,130,"-", textStyle).setInteractive({useHandCursor:true}).on('pointerdown', () => {this.fastUnits = this.fastUnits <= 1 ? this.fastUnits: this.fastUnits - 1; fuC.setText(this.fastUnits)});;
    var fuB = this.add.text(10, 90,"Fast Units", textStyle);
    var fuC = this.add.text(85, 130,"1", textStyle);
    // var tsA = this.add.text(10, 210,"+", textStyle).setInteractive({useHandCursor:true}).on('pointerdown', () => {this.team++; tsC.setText(this.team)});
    // var tsS = this.add.text(155,210,"-", textStyle).setInteractive({useHandCursor:true}).on('pointerdown', () => {this.team = this.team <= 0 ? this.team: this.team - 1; tsC.setText(this.team)});;
    // var tsB = this.add.text(10, 170,"Team", textStyle);
    // var tsC = this.add.text(85, 210,"0", textStyle);
    var cfB = this.add.text(50, 170, "Create", textStyle).setInteractive({useHandCursor:true}).on('pointerdown', () => {
      var units = []
      for(var i = 0; i < this.slowUnits; i++){
        units.push(this.gameScene.gameManager.factory.add.SlowUnit(this.gameScene, -300, 300, this.team + "Heavy",this.team));
      }
      for(var i = 0; i < this.fastUnits; i++){
        units.push(this.gameScene.gameManager.factory.add.FastUnit(this.gameScene, -300, 300, this.team + "Light",this.team));
      }
      var formation = this.gameScene.gameManager.factory.add.Formation(units)
      formation.flagship.setObjective(new Objective(-100,300, gametools.statics.commands.MOVE))
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
