class GameInterface extends Phaser.Scene{
  constructor(){
    super("game-interface")
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
    this.values = {}
    this.values.factory = {
      open:false,
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
    var x = 0;
    var y = 564/2

    this.buttons.factoryButton = new CircleLabelButton(this,"Build", this.textStyles.main, 1, x, y, 100, 0x0000ff, 1)
    this.buttons.factoryButton.setOrigin(-0.1,0.5)
    this.buttons.factoryButton.setInteractive({useHandCursor:true}).on("pointerdown", ()=>{
      if(this.values.factory.open){
        this.setSelectorMenu(false)
        this.setFighterMenu(false)
        this.setFrigateMenu(false)
        this.setCruiserMenu(false)
        this.values.factory.open = false
      }else{
        this.setSelectorMenu(true)
        this.setFighterMenu(false)
        this.setFrigateMenu(false)
        this.setCruiserMenu(false)
        this.values.factory.open = true
      }
    })


    this.buttons.fighterButton          = new CircleLabelButton(this, "Fighters", this.textStyles.sub   , 1, x+55    , y-105   , 50, 0x0000ff, 1)
    this.buttons.lightFighterAdd        = new CircleLabelButton(this, "Light"   , this.textStyles.sub   , 1, x+80    , y-200   , 40, 0x0000ff, 1)
    this.buttons.lightFighterRemove     = new CircleLabelButton(this, "-"       , this.textStyles.remove, 1, x+80+27 , y-200-27, 8 , 0xff0000, 1)
    this.buttons.heavyFighterAdd        = new CircleLabelButton(this, "Heavy"   , this.textStyles.sub   , 1, x+145   , y-135   , 40, 0x0000ff, 1)
    this.buttons.heavyFighterRemove     = new CircleLabelButton(this, "-"       , this.textStyles.remove, 1, x+145+27, y-135-27, 8 , 0xff0000, 1)


    this.buttons.frigateButton          = new CircleLabelButton(this, "Frigates", this.textStyles.sub   , 1, x+115   , y       , 50, 0x0000ff ,1)
    this.buttons.swatterFrigateAdd      = new CircleLabelButton(this, "Swatter" , this.textStyles.sub   , 1, x+170   , y-75    , 40, 0x0000ff ,1)
    this.buttons.swatterFrigateRemove   = new CircleLabelButton(this, "-"       , this.textStyles.remove, 1, x+170+27, y-75-27 , 8 , 0xff0000 ,1)
    this.buttons.bastionFrigateAdd      = new CircleLabelButton(this, "Bastion" , this.textStyles.sub   , 1, x+205   , y       , 40, 0x0000ff ,1)
    this.buttons.bastionFrigateRemove   = new CircleLabelButton(this, "-"       , this.textStyles.remove, 1, x+225+27, y-27    , 8 , 0xff0000 ,1)
    this.buttons.slammerFrigateAdd      = new CircleLabelButton(this, "Slammer" , this.textStyles.sub   , 1, x+170   , y+75    , 40, 0x0000ff ,1)
    this.buttons.slammerFrigateRemove   = new CircleLabelButton(this, "-"       , this.textStyles.remove, 1, x+170+27, y+75    , 8 , 0xff0000 ,1)



    this.buttons.cruiserButton          = new CircleLabelButton(this, "Cruisers" , this.textStyles.sub   , 1, x+55    ,y+105   , 50, 0x0000ff ,1)
    this.buttons.leviathanCruiserAdd    = new CircleLabelButton(this, "Leviathan", this.textStyles.sub   , 1, x+80    ,y+200   , 40, 0x0000ff ,1)
    this.buttons.leviathanCruiserRemove = new CircleLabelButton(this, "-"        , this.textStyles.remove, 1, x+80+27 ,y+200-27, 8 , 0xff0000 ,1)
    this.buttons.hunterCruiserAdd       = new CircleLabelButton(this, "Hunter"   , this.textStyles.sub   , 1, x+145   ,y+135   , 40, 0x0000ff ,1)
    this.buttons.hunterCruiserRemove    = new CircleLabelButton(this, "-"        , this.textStyles.remove, 1, x+145+27,y+135-27, 8 , 0xff0000 ,1)



    this.buttons.fighterButton.setInteractive({useHandCursor:true})          .on("pointerdown", ()=>{this.setFighterMenu(true)})
    this.buttons.lightFighterAdd.setInteractive({useHandCursor:true})        .on("pointerdown", ()=>{console.log("Light Fighter Add");})
    this.buttons.lightFighterRemove.setInteractive({useHandCursor:true})     .on("pointerdown", ()=>{console.log("Light Fighter Remove");})
    this.buttons.heavyFighterAdd.setInteractive({useHandCursor:true})        .on("pointerdown", ()=>{console.log("Heavy Fighter Add");})
    this.buttons.heavyFighterRemove.setInteractive({useHandCursor:true})     .on("pointerdown", ()=>{console.log("Heavy Fighter Remove");})

    this.buttons.frigateButton.setInteractive({useHandCursor:true})          .on("pointerdown", ()=>{this.setFrigateMenu(true)})
    this.buttons.swatterFrigateAdd.setInteractive({useHandCursor:true})      .on("pointerdown", ()=>{console.log("Swatter Frigate Add");})
    this.buttons.swatterFrigateRemove.setInteractive({useHandCursor:true})   .on("pointerdown", ()=>{console.log("Swatter Frigate Remove");})
    this.buttons.bastionFrigateAdd.setInteractive({useHandCursor:true})      .on("pointerdown", ()=>{console.log("Bastion Frigate Add");})
    this.buttons.bastionFrigateRemove.setInteractive({useHandCursor:true})   .on("pointerdown", ()=>{console.log("Bastion Frigate Remove");})
    this.buttons.slammerFrigateAdd.setInteractive({useHandCursor:true})      .on("pointerdown", ()=>{console.log("Slammer Frigate Add");})
    this.buttons.slammerFrigateRemove.setInteractive({useHandCursor:true})   .on("pointerdown", ()=>{console.log("Slammer Frigate Remove");})

    this.buttons.cruiserButton.setInteractive({useHandCursor:true})          .on("pointerdown", ()=>{this.setCruiserMenu(true)})
    this.buttons.hunterCruiserAdd.setInteractive({useHandCursor:true})       .on("pointerdown", ()=>{console.log("Hunter Cruiser Add");})
    this.buttons.hunterCruiserRemove.setInteractive({useHandCursor:true})    .on("pointerdown", ()=>{console.log("Hunter Cruiser Remove");})
    this.buttons.leviathanCruiserAdd.setInteractive({useHandCursor:true})    .on("pointerdown", ()=>{console.log("Leviathan Cruiser Add");})
    this.buttons.leviathanCruiserRemove.setInteractive({useHandCursor:true}) .on("pointerdown", ()=>{console.log("Leviathan Cruiser Remove");})
  }
  setSelectorMenu(value){
    this.buttons.fighterButton.setVisible(value)
    this.buttons.frigateButton.setVisible(value)
    this.buttons.cruiserButton.setVisible(value)
  }
  setFighterMenu(value){
    this.buttons.lightFighterAdd   .setVisible(value)
    this.buttons.lightFighterRemove.setVisible(value)
    this.buttons.heavyFighterAdd   .setVisible(value)
    this.buttons.heavyFighterRemove.setVisible(value)
    if(value){
      this.setFrigateMenu(false)
      this.setCruiserMenu(false)
    }
  }
  setFrigateMenu(value){
    this.buttons.swatterFrigateAdd   .setVisible(value)
    this.buttons.swatterFrigateRemove.setVisible(value)
    this.buttons.bastionFrigateAdd   .setVisible(value)
    this.buttons.bastionFrigateRemove.setVisible(value)
    this.buttons.slammerFrigateAdd   .setVisible(value)
    this.buttons.slammerFrigateRemove.setVisible(value)
    if(value){
      this.setFighterMenu(false)
      this.setCruiserMenu(false)
    }
  }
  setCruiserMenu(value){
    this.buttons.hunterCruiserAdd      .setVisible(value)
    this.buttons.hunterCruiserRemove   .setVisible(value)
    this.buttons.leviathanCruiserAdd   .setVisible(value)
    this.buttons.leviathanCruiserRemove.setVisible(value)
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
