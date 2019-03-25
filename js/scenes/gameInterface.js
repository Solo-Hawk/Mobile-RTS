class GameInterface extends Phaser.Scene{
  constructor(){
    super("game-interface");
  }
  init(gameScene){
      this.textStyles = {
        main:{
          fontSize: '22px',
          fontFamily: 'Trebuchet MS',
          color: '#ffffff',
          align: 'center'},
        sub:{
          fontSize: '18px',
          fontFamily: 'Trebuchet MS',
          color: '#ffffff',
          align: 'center'
        },
        description:{
          fontSize: '15px',
          fontFamily: 'Trebuchet MS',
          color: '#ffffff',
          align: 'center'
        },
        remove:{
          fontSize: '32px',
          fontFamily: 'Trebuchet MS',
          color: '#ffffff',
          align: 'center'
        }
      }
  }

  preload(){

  }

  create(){
    console.log("HERE");
    this.values = {};
    this.values.config = {
      formation:{
        maxRating: 180,
        maxCapacity: 30
      },
      fighters: {
        heavy: {
          cost: 25,
          rating: 2
        },
        light: {
          cost: 10,
          rating: 1
        }
      },
      frigates: {
        swatter:{
          cost: 50,
          rating: 18
        },
        bastion:{
          cost: 70,
          rating: 22
        },
        slammer:{
          cost: 110,
          rating: 26
        }
      },
      cruisers: {
        leviathan: {
          cost: 450,
          rating: 100
        },
        hunter: {
          cost: 600,
          rating: 124
        }
      }
    }
    this.values.factory = {
      open:false,
      rating: 0,
      capacity: 0,
      fighters: {
        heavy: 0,
        light: 0
      },
      frigates: {
        swatter:0,
        bastion:0,
        slammer:0
      },
      cruisers: {
        leviathan: 0,
        hunter: 0
      }
    }
    this.buttons = {}

    {
    // var rectButton = new RectLabelButton(this,"Game Button", this.textStyle ,1, 300, 300, 150, 50, 0xff0000, 1)
    // rectButton.setInteractive({useHandCursor:true}).on("pointerdown", ()=>{console.log("Button is down", this);})

    // var circButton = new CircleLabelButton(this,"Factory", this.textStyle, 1, 0, 300, 100, 0x0000ff, 1)
    // circButton.setInteractive({useHandCursor:true}).on("pointerdown", ()=>{console.log("Button is down", this);})
    }

    //Factory UI Button System
    var x = 10;
    console.log(this);
    var y = this.sys.canvas.height - 10;


    this.buttons.factoryButton = new CircleLabelButton(this,"Build", this.textStyles.main, 1, x, y, 100, 0x0000ff, 1)
    this.buttons.factoryButton.setOrigin(-0.1,0.5)
    this.buttons.factoryButton.setInteractive({useHandCursor:true}).on("pointerdown", ()=>{
      if(this.values.factory.open){
        this.values.factory.open = false
        this.setSelectorMenu(false)
        this.setFighterMenu(false)
        this.setFrigateMenu(false)
        this.setCruiserMenu(false)
      }else{
        this.values.factory.open = true
        this.setSelectorMenu(true)
        this.setFighterMenu(false)
        this.setFrigateMenu(false)
        this.setCruiserMenu(false)
      }
    });


    this.buttons.fighterButton               = new CircleLabelButton(this, "Fighters", this.textStyles.sub         , 1, x+25    , y-200   , 50, 0x0000ff, 1)
    var fib={x: this.buttons.fighterButton.x, y: this.buttons.fighterButton.y}
    this.buttons.lightFighterAdd             = new CircleLabelButton(this, "Light"   , this.textStyles.description , 1, fib.x    , fib.y-80 , 35, 0x0000ff, 1)
    this.buttons.lightFighterRemove          = new CircleLabelButton(this, "-"       , this.textStyles.remove      , 1, fib.x+27 , fib.y-80-27, 8 , 0xff0000, 1)
    this.buttons.lightFighterLabel           = new CircleLabelButton(this, "0"       , this.textStyles.remove      , 1, fib.x , fib.y-50 , 8 , 0xff0000, 0)

    this.buttons.heavyFighterAdd             = new CircleLabelButton(this, "Heavy"   , this.textStyles.description , 1, fib.x+65   , fib.y-50   , 35, 0x0000ff, 1)
    this.buttons.heavyFighterRemove          = new CircleLabelButton(this, "-"       , this.textStyles.remove      , 1, fib.x+65+27, fib.y-50-27, 8 , 0xff0000, 1)
    this.buttons.heavyFighterLabel           = new CircleLabelButton(this, "0"       , this.textStyles.remove      , 1, fib.x+40 , fib.y-30, 8 , 0xff0000, 0)


    this.buttons.frigateButton               = new CircleLabelButton(this, "Frigates", this.textStyles.sub         , 1, x+140   , y-140       , 50, 0x0000ff, 1)
    var frb={x: this.buttons.frigateButton.x, y: this.buttons.frigateButton.y}
    this.input.on("pointerdown", (pointer)=>{console.log(pointer.worldX-frb.x,pointer.worldY - frb.y);})
    this.buttons.swatterFrigateAdd           = new CircleLabelButton(this, "Swatter" , this.textStyles.description , 1, frb.x   , frb.y-80    , 35, 0x0000ff, 1)
    this.buttons.swatterFrigateRemove        = new CircleLabelButton(this, "-"       , this.textStyles.remove      , 1, frb.x+27, frb.y-80-27 , 8 , 0xff0000, 1)
    this.buttons.swatterFrigateLabel        = new CircleLabelButton(this, "0"        , this.textStyles.remove      , 1, frb.x, frb.y-50    , 8 , 0xff0000, 0)

    this.buttons.bastionFrigateAdd           = new CircleLabelButton(this, "Bastion" , this.textStyles.description , 1, frb.x+205   , frb.y       , 35, 0x0000ff, 1)
    this.buttons.bastionFrigateRemove        = new CircleLabelButton(this, "-"       , this.textStyles.remove      , 1, frb.x+205+27, frb.y-27    , 8 , 0xff0000, 1)
    this.buttons.bastionFrigateLabel         = new CircleLabelButton(this, "0"       , this.textStyles.remove      , 1, frb.x+205+40, frb.y       , 8 , 0xff0000, 0)

    this.buttons.slammerFrigateAdd           = new CircleLabelButton(this, "Slammer" , this.textStyles.description , 1, frb.x+170   , frb.y+75    , 35, 0x0000ff, 1)
    this.buttons.slammerFrigateRemove        = new CircleLabelButton(this, "-"       , this.textStyles.remove      , 1, frb.x+170+27, frb.y+75-27 , 8 , 0xff0000, 1)
    this.buttons.slammerFrigateLabel         = new CircleLabelButton(this, "0"       , this.textStyles.remove      , 1, frb.x+170+50, frb.y+75    , 8 , 0xff0000, 0)


    this.buttons.cruiserButton               = new CircleLabelButton(this, "Cruisers" , this.textStyles.sub        , 1, x+200    , y-25   , 50, 0x0000ff, 1)
    var crb={x: this.buttons.cruiserButton.x, y: this.buttons.cruiserButton.y}
    this.buttons.leviathanCruiserAdd         = new CircleLabelButton(this, "Leviathan", this.textStyles.description, 1, crb.x+60    , crb.y+200   , 35, 0x0000ff, 1)
    this.buttons.leviathanCruiserRemove      = new CircleLabelButton(this, "-"        , this.textStyles.remove     , 1, crb.x+60+27 , crb.y+200-27, 8 , 0xff0000, 1)
    this.buttons.leviathanCruiserLabel       = new CircleLabelButton(this, "0"        , this.textStyles.remove     , 1, crb.x+60+50 , crb.y+200   , 8 , 0xff0000, 0)

    this.buttons.hunterCruiserAdd            = new CircleLabelButton(this, "Hunter"   , this.textStyles.description, 1, crb.x+125   , crb.y+135   , 35, 0x0000ff, 1)
    this.buttons.hunterCruiserRemove         = new CircleLabelButton(this, "-"        , this.textStyles.remove     , 1, crb.x+125+27, crb.y+135-27, 8 , 0xff0000, 1)
    this.buttons.hunterCruiserLabel          = new CircleLabelButton(this, "0"        , this.textStyles.remove     , 1, crb.x+125+50, crb.y+135   , 8 , 0xff0000, 0)



    this.buttons.fighterButton          .setInteractive({useHandCursor:true}).on("pointerdown", ()=>{this.setFighterMenu(true);})
    this.buttons.lightFighterAdd        .setInteractive({useHandCursor:true}).on("pointerdown", ()=>{this.changeLightFighter(1);})
    this.buttons.lightFighterRemove     .setInteractive({useHandCursor:true}).on("pointerdown", ()=>{this.changeLightFighter(-1);})
    this.buttons.heavyFighterAdd        .setInteractive({useHandCursor:true}).on("pointerdown", ()=>{this.changeHeavyFighter(1);})
    this.buttons.heavyFighterRemove     .setInteractive({useHandCursor:true}).on("pointerdown", ()=>{this.changeHeavyFighter(-1);})

    this.buttons.frigateButton          .setInteractive({useHandCursor:true}).on("pointerdown", ()=>{this.setFrigateMenu(true);})
    this.buttons.swatterFrigateAdd      .setInteractive({useHandCursor:true}).on("pointerdown", ()=>{this.changeSwatterFrigate(1);})
    this.buttons.swatterFrigateRemove   .setInteractive({useHandCursor:true}).on("pointerdown", ()=>{this.changeSwatterFrigate(-1);})
    this.buttons.bastionFrigateAdd      .setInteractive({useHandCursor:true}).on("pointerdown", ()=>{this.changeBastionFrigate(1);})
    this.buttons.bastionFrigateRemove   .setInteractive({useHandCursor:true}).on("pointerdown", ()=>{this.changeBastionFrigate(-1);})
    this.buttons.slammerFrigateAdd      .setInteractive({useHandCursor:true}).on("pointerdown", ()=>{this.changeSlammerFrigate(1);})
    this.buttons.slammerFrigateRemove   .setInteractive({useHandCursor:true}).on("pointerdown", ()=>{this.changeSlammerFrigate(-1);})

    this.buttons.cruiserButton          .setInteractive({useHandCursor:true}).on("pointerdown", ()=>{this.setCruiserMenu(true);})
    this.buttons.hunterCruiserAdd       .setInteractive({useHandCursor:true}).on("pointerdown", ()=>{this.changeHunterCruiser(1);})
    this.buttons.hunterCruiserRemove    .setInteractive({useHandCursor:true}).on("pointerdown", ()=>{this.changeHunterCruiser(-1);})
    this.buttons.leviathanCruiserAdd    .setInteractive({useHandCursor:true}).on("pointerdown", ()=>{this.changeLeviathanCruiser(1);})
    this.buttons.leviathanCruiserRemove .setInteractive({useHandCursor:true}).on("pointerdown", ()=>{this.changeLeviathanCruiser(-1);})

    // this.setSelectorMenu(false)
    // this.setFighterMenu(false)
    // this.setFrigateMenu(false)
    // this.setCruiserMenu(false)
  }
  changeLightFighter(value){
    var newValue = this.values.factory.fighters.light + value
    var newRating = this.values.factory.rating + (this.values.config.fighters.light.rating * value)
    var newCapacity = this.values.factory.capacity + value
    if(newRating > this.values.config.formation.maxRating || newCapacity > this.values.config.formation.maxCapacity){
      return
    }
    if(newValue < 0){
      return
    }
    this.values.factory.fighters.light = newValue
    this.values.factory.capacity = newCapacity
    this.values.factory.rating = newRating
    this.updateLabels()
  }
  changeHeavyFighter(value){
    var newValue = this.values.factory.fighters.heavy + value
    var newRating = this.values.factory.rating + (this.values.config.fighters.heavy.rating  * value)
    var newCapacity = this.values.factory.capacity + value
    if(newRating > this.values.config.formation.maxRating || newCapacity > this.values.config.formation.maxCapacity){
      return
    }
    if(newValue < 0){
      return
    }
    this.values.factory.fighters.heavy = newValue
    this.values.factory.capacity = newCapacity
    this.values.factory.rating = newRating
    this.updateLabels()
  }
  changeSwatterFrigate(value){
    var newValue = this.values.factory.frigates.swatter + value
    var newRating = this.values.factory.rating + (this.values.config.frigates.swatter.rating * value)
    var newCapacity = this.values.factory.capacity + value
    if(newRating > this.values.config.formation.maxRating || newCapacity > this.values.config.formation.maxCapacity){
      return
    }
    if(newValue < 0){
      return
    }
    this.values.factory.frigates.swatter = newValue
    this.values.factory.capacity = newCapacity
    this.values.factory.rating = newRating
    this.updateLabels()
  }
  changeBastionFrigate(value){
    var newValue = this.values.factory.frigates.bastion + value
    var newRating = this.values.factory.rating + (this.values.config.frigates.bastion.rating * value)
    var newCapacity = this.values.factory.capacity + value
    if(newRating > this.values.config.formation.maxRating || newCapacity > this.values.config.formation.maxCapacity){
      return
    }
    if(newValue < 0){
      return
    }
    this.values.factory.frigates.bastion = newValue
    this.values.factory.capacity = newCapacity
    this.values.factory.rating = newRating
    this.updateLabels()
  }
  changeSlammerFrigate(value){
    var newValue = this.values.factory.frigates.slammer + value
    var newRating = this.values.factory.rating + (this.values.config.frigates.slammer.rating * value)
    var newCapacity = this.values.factory.capacity + value
    if(newRating > this.values.config.formation.maxRating || newCapacity > this.values.config.formation.maxCapacity){
      return
    }
    if(newValue < 0){
      return
    }
    this.values.factory.frigates.slammer = newValue
    this.values.factory.capacity = newCapacity
    this.values.factory.rating = newRating
    this.updateLabels()
  }
  changeHunterCruiser(value){
    var newValue = this.values.factory.cruisers.hunter + value
    var newRating = this.values.factory.rating + (this.values.config.cruisers.hunter.rating * value)
    // var newCapacity = this.values.factory.capacity + value
    // if(newRating > this.values.config.formation.maxRating || newCapacity > this.values.config.formation.maxCapacity){
    if(newRating > this.values.config.formation.maxRating){
      return;
    }
    if(newValue < 0){
      return
    }
    this.values.factory.cruisers.hunter = newValue
    // this.values.factory.capacity = newCapacity
    this.values.factory.rating = newRating
    this.updateLabels()
  }
  changeLeviathanCruiser(value){
    var newValue = this.values.factory.cruisers.leviathan + value
    var newRating = this.values.factory.rating + (this.values.config.cruisers.leviathan.rating * value)
    // var newCapacity = this.values.factory.capacity + value
    // if(newRating > this.values.config.formation.maxRating || newCapacity > this.values.config.formation.maxCapacity){
    if(newRating > this.values.config.formation.maxRating){
      return;
    }
    if(newValue < 0){
      return
    }
    this.values.factory.cruisers.leviathan = newValue
    // this.values.factory.capacity = newCapacity
    this.values.factory.rating = newRating
    this.updateLabels()
  }
  updateLabels(){
    console.log(this.values.factory.rating);
    this.buttons.lightFighterLabel      .setText(this.values.factory.fighters.light)
    this.buttons.heavyFighterLabel    .setText(this.values.factory.fighters.heavy)
    this.buttons.swatterFrigateLabel    .setText(this.values.factory.frigates.swatter)
    this.buttons.bastionFrigateLabel  .setText(this.values.factory.frigates.bastion)
    this.buttons.slammerFrigateLabel    .setText(this.values.factory.frigates.slammer)
    this.buttons.hunterCruiserLabel   .setText(this.values.factory.cruisers.hunter)
    this.buttons.leviathanCruiserLabel  .setText(this.values.factory.cruisers.leviathan)
  }

  setSelectorMenu(value){
    this.buttons.fighterButton.setVisible(value)
    this.buttons.frigateButton.setVisible(value)
    this.buttons.cruiserButton.setVisible(value)
  }
  setFighterMenu(value){
    this.buttons.lightFighterAdd            .setVisible(value)
    this.buttons.lightFighterRemove         .setVisible(value)
    this.buttons.lightFighterOpenLabel      .setVisible(value&&this.values.factory.open)
    this.buttons.lightFighterClosedLabel    .setVisible(!value&&this.values.factory.open)
    this.buttons.heavyFighterAdd            .setVisible(value)
    this.buttons.heavyFighterRemove         .setVisible(value)
    this.buttons.heavyFighterOpenLabel      .setVisible(value&&this.values.factory.open)
    this.buttons.heavyFighterClosedLabel    .setVisible(!value&&this.values.factory.open)
    if(value){
      this.setFrigateMenu(false)
      this.setCruiserMenu(false)
    }
  }
  setFrigateMenu(value){
    this.buttons.swatterFrigateAdd          .setVisible(value)
    this.buttons.swatterFrigateRemove       .setVisible(value)
    this.buttons.swatterFrigateOpenLabel    .setVisible(value&&this.values.factory.open)
    this.buttons.swatterFrigateClosedLabel  .setVisible(!value&&this.values.factory.open)
    this.buttons.bastionFrigateAdd          .setVisible(value)
    this.buttons.bastionFrigateRemove       .setVisible(value)
    this.buttons.bastionFrigateOpenLabel    .setVisible(value&&this.values.factory.open)
    this.buttons.bastionFrigateClosedLabel  .setVisible(!value&&this.values.factory.open)
    this.buttons.slammerFrigateAdd          .setVisible(value)
    this.buttons.slammerFrigateRemove       .setVisible(value)
    this.buttons.slammerFrigateOpenLabel    .setVisible(value&&this.values.factory.open)
    this.buttons.slammerFrigateClosedLabel  .setVisible(!value&&this.values.factory.open)
    if(value){
      this.setFighterMenu(false)
      this.setCruiserMenu(false)
    }
  }
  setCruiserMenu(value){
    this.buttons.hunterCruiserAdd           .setVisible(value)
    this.buttons.hunterCruiserRemove        .setVisible(value)
    this.buttons.hunterCruiserOpenLabel     .setVisible(value&&this.values.factory.open)
    this.buttons.hunterCruiserClosedLabel   .setVisible(!value&&this.values.factory.open)
    this.buttons.leviathanCruiserAdd        .setVisible(value)
    this.buttons.leviathanCruiserRemove     .setVisible(value)
    this.buttons.leviathanCruiserOpenLabel  .setVisible(value&&this.values.factory.open)
    this.buttons.leviathanCruiserClosedLabel.setVisible(!value&&this.values.factory.open)
    if(value){
      this.setFighterMenu(false)
      this.setFrigateMenu(false)
    }
  }




}

class RectLabelButton extends Phaser.GameObjects.Text{
  constructor(scene,text,textStyle,textalpha,x,y,width,height,fillColor,fillAlpha){
    console.log("Adding Button");
    super(scene,x,y,text,textStyle)

    this.scene = scene
    this.body = this.scene.add.rectangle(x,y,width,height,fillColor,fillAlpha)

    this.setOrigin(0.5,0.5)
    this.setDepth(320)
    this.body.setDepth(300)
    this.scene.add.existing(this.body)
    this.scene.add.existing(this)
  }
  setInteractive(config){
    this.body.setInteractive(config)
    return this
  }

  on(eventcall,func,context){
    this.body.on(eventcall, func,context)
    return this
  }

  setVisible(value){
    super.setVisible(value)
    this.body.setVisible(value)
  }

}

class CircleLabelButton extends Phaser.GameObjects.Text{
  constructor(scene,text,textStyle,textalpha,x,y,radius,fillColor,fillAlpha){
    console.log("Adding Button");
    super(scene,x,y,text,textStyle)

    this.scene = scene
    this.body = this.scene.add.circle(x,y,radius,fillColor,fillAlpha)

    this.setOrigin(0.5)
    this.setDepth(320)
    this.body.setDepth(300)
    this.scene.add.existing(this.body)
    this.scene.add.existing(this)
  }
  setInteractive(config){
    this.body.setInteractive(config)
    return this
  }

  on(eventcall,func,context){
    this.body.on(eventcall, func,context)
    return this
  }

  setVisible(value){
    super.setVisible(value)
    this.body.setVisible(value)
  }

}
