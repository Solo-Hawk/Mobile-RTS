class SceneLevelDevelopment extends Phaser.Scene{
  constructor(){
    super("level-development")
  }
  preload(){

  }
  create(){
    this.gameManager = new GameManager(this)
    var units = []
    console.log(this.gameManager.createUnit);
    units[0] = this.gameManager.add.unit.SlowUnit(this, Math.random() * 1600, Math.random() * 800, 'red1')
    units[1] = this.gameManager.add.unit.FastUnit(this, Math.random() * 1600, Math.random() * 800, 'blue1')
    units[2] = this.gameManager.add.unit.FastUnit(this, Math.random() * 1600, Math.random() * 800, 'blue1')
    units[3] = this.gameManager.add.unit.FastUnit(this, Math.random() * 1600, Math.random() * 800, 'blue1')
    console.log(units);

      console.log(units[3]);

    this.formation = this.gameManager.add.formation.Formation(this,units)
    this.formation.setObjective(new MoveTo(Math.random() * 1600, Math.random() * 800))
    setInterval((formation) => {
      console.log(formation);
      formation.setObjective(new MoveTo(Math.random() * 1600, Math.random() * 800))
    },
    12000,
    this.formation)
    this.createButtons.call(this)


    console.log(units);
    console.log(this);

    setTimeout((unit) => {unit.destroy();}, 8000, units[2])

  }

  createButtons(){
    this.buttons = {}
    this.buttons.createUnit = this.newLabeledButton("Create Unit",140,40,240,40)
    this.buttons.createUnit.body.setInteractive({useHandCursor:true})
    .on('pointerover', () => {this.buttons.createUnit.body.setFillStyle(0x3700B3);})
    .on('pointerout', () => {this.buttons.createUnit.body.setFillStyle(0x6200EE);})
    .on('pointerdown', () => {this.gameManager.add.unit.FastUnit(this, Math.random() * 1600, Math.random() * 800, 'blue1');})
    .on('pointerup', () => {this.buttons.createUnit.body.setFillStyle(0x3700B3);});

    this.buttons.createForm = this.newLabeledButton("Create Formation",140,100,240,40)
    this.buttons.createForm.body.setInteractive({useHandCursor:true})
    .on('pointerover', () => {this.buttons.createForm.body.setFillStyle(0x3700B3);})
    .on('pointerout', () => {this.buttons.createForm.body.setFillStyle(0x6200EE);})
    .on('pointerdown', () => {
      var units = []
      units[0] = this.gameManager.add.unit.SlowUnit(this, Math.random() * 1600, Math.random() * 800, 'red1')
      units[1] = this.gameManager.add.unit.FastUnit(this, Math.random() * 1600, Math.random() * 800, 'blue1')
      units[2] = this.gameManager.add.unit.FastUnit(this, Math.random() * 1600, Math.random() * 800, 'blue1')
      units[3] = this.gameManager.add.unit.FastUnit(this, Math.random() * 1600, Math.random() * 800, 'blue1')

      var formation = this.gameManager.add.formation.Formation(this,units)

      formation.setObjective(new MoveTo(Math.random() * 1600, Math.random() * 800))
      setInterval((formation) => {
        formation.setObjective(new MoveTo(Math.random() * 1600, Math.random() * 800))

      },12000,
      formation)
    })

    .on('pointerup', () => {this.buttons.createForm.body.setFillStyle(0x3700B3);});

  }
  update(delta,time){
    // console.log(time);
    this.gameManager.update()

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
