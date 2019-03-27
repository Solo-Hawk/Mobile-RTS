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
        light: {
          cost: 10,
          rating: 1
        },
        heavy: {
          cost: 25,
          rating: 2
        }
      },
      frigates: {
        swatter:{
          cost: 110,
          rating: 14
        },
        bastion:{
          cost: 135,
          rating: 16
        },
        slammer:{
          cost: 180,
          rating: 20
        }
      },
      cruisers: {
        leviathan: {
          cost: 700,
          rating: 100
        },
        hunter: {
          cost: 950,
          rating: 124
        }
      }
    }
    this.values.factory = {
      open:false,
      rating: 0,
      capacity: 0,
      cost:0,
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
    this.values.game = {
      constructionUnits: 1000
    }
    this.buttons = {}

    this.events.on("item-selected", (interfaceComponent)=>{
      this.setFocus(interfaceComponent)
    }, this)

    this.createFactoryUI()
  }
  update(delta, time){
    this.buttons.constructionUnitsLabel.setText(this.values.game.constructionUnits+" CU")
  }


  createFactoryUI(){
    //Factory UI Button System
    var x = 10;
    console.log(this);
    var y = this.sys.canvas.height - 10;


    this.buttons.factoryButton = new CircleLabelButton(this,"Build", this.textStyles.main, 1, x, y, 100, 0x0000ff, 1)
    this.buttons.factoryButton.setOrigin(-0.25,1.50)
    this.buttons.factoryButton.setInteractive().on("pointerdown", ()=>{
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
    })



    this.buttons.fighterButton               = new CircleLabelButton(this, "Fighters", this.textStyles.sub         , 1, x+25      , y-150      , 50, 0x0000ff, 1)
    var fib={x: this.buttons.fighterButton.x, y: this.buttons.fighterButton.y}

    this.buttons.lightFighterAdd             = new CircleLabelButton(this,""         , this.textStyles.description, 1, fib.x      , fib.y-90   , 35, 0x0000ff, 1)
    this.buttons.lightFighterRemove          = new CircleLabelButton(this, "-"       , this.textStyles.remove     , 1, fib.x+27   , fib.y-90-27, 8 , 0xff0000, 1)
    this.buttons.lightFighterLabel           = new CircleLabelButton(this, "0"       , this.textStyles.remove     , 1, fib.x      , fib.y-50   , 8 , 0xff0000, 0)

    this.buttons.heavyFighterAdd             = new CircleLabelButton(this, ""        , this.textStyles.description, 1, fib.x+70   , fib.y-55   , 35, 0x0000ff, 1)
    this.buttons.heavyFighterRemove          = new CircleLabelButton(this, "-"       , this.textStyles.remove     , 1, fib.x+70+27, fib.y-55-27, 8 , 0xff0000, 1)
    this.buttons.heavyFighterLabel           = new CircleLabelButton(this, "0"       , this.textStyles.remove     , 1, fib.x+40   , fib.y-30   , 8 , 0xff0000, 0)


    this.buttons.frigateButton               = new CircleLabelButton(this, "Frigates", this.textStyles.sub        , 1, x+110      , y-110      , 50, 0x0000ff, 1)
    var frb={x: this.buttons.frigateButton.x, y: this.buttons.frigateButton.y}

    this.buttons.swatterFrigateAdd           = new CircleLabelButton(this, ""        , this.textStyles.description, 1, frb.x      , frb.y-90   , 35, 0x0000ff, 1)
    this.buttons.swatterFrigateRemove        = new CircleLabelButton(this, "-"       , this.textStyles.remove     , 1, frb.x+27   , frb.y-90-27, 8 , 0xff0000, 1)
    this.buttons.swatterFrigateLabel         = new CircleLabelButton(this, "0"       , this.textStyles.remove     , 1, frb.x      , frb.y-50   , 8 , 0xff0000, 0)

    this.buttons.bastionFrigateAdd           = new CircleLabelButton(this, ""        , this.textStyles.description, 1, frb.x+60   , frb.y-60   , 35, 0x0000ff, 1)
    this.buttons.bastionFrigateRemove        = new CircleLabelButton(this, "-"       , this.textStyles.remove     , 1, frb.x+60+27, frb.y-60-27, 8 , 0xff0000, 1)
    this.buttons.bastionFrigateLabel         = new CircleLabelButton(this, "0"       , this.textStyles.remove     , 1, frb.x+35   , frb.y-35   , 8 , 0xff0000, 0)

    this.buttons.slammerFrigateAdd           = new CircleLabelButton(this, ""        , this.textStyles.description, 1, frb.x+90   , frb.y      , 35, 0x0000ff, 1)
    this.buttons.slammerFrigateRemove        = new CircleLabelButton(this, "-"       , this.textStyles.remove     , 1, frb.x+90+27, frb.y-27   , 8 , 0xff0000, 1)
    this.buttons.slammerFrigateLabel         = new CircleLabelButton(this, "0"       , this.textStyles.remove     , 1, frb.x+50   , frb.y      , 8 , 0xff0000, 0)


    this.buttons.cruiserButton               = new CircleLabelButton(this, "Cruisers", this.textStyles.sub        , 1, x+150      , y-25       , 50, 0x0000ff, 1)
    var crb={x: this.buttons.cruiserButton.x, y: this.buttons.cruiserButton.y}

    this.buttons.leviathanCruiserAdd         = new CircleLabelButton(this, ""        , this.textStyles.description, 1, crb.x+55   , crb.y-70   , 35, 0x0000ff, 1)
    this.buttons.leviathanCruiserRemove      = new CircleLabelButton(this, "-"       , this.textStyles.remove     , 1, crb.x+55+27, crb.y-70-27, 8 , 0xff0000, 1)
    this.buttons.leviathanCruiserLabel       = new CircleLabelButton(this, "0"       , this.textStyles.remove     , 1, crb.x+30   , crb.y-40   , 8 , 0xff0000, 0)

    this.buttons.hunterCruiserAdd            = new CircleLabelButton(this, ""        , this.textStyles.description, 1, crb.x+90   , crb.y      , 35, 0x0000ff, 1)
    this.buttons.hunterCruiserRemove         = new CircleLabelButton(this, "-"       , this.textStyles.remove     , 1, crb.x+90+27, crb.y-27   , 8 , 0xff0000, 1)
    this.buttons.hunterCruiserLabel          = new CircleLabelButton(this, "0"       , this.textStyles.remove     , 1, crb.x+50   , crb.y      , 8 , 0xff0000, 0)


    this.buttons.lightFighterAdd    .setText(this.values.config.fighters.light.rating     +"r\nLight\n"     +this.values.config.fighters.light.cost      +"CU")
    this.buttons.heavyFighterAdd    .setText(this.values.config.fighters.heavy.rating     +"r\nHeavy\n"     +this.values.config.fighters.heavy.cost      +"CU")
    this.buttons.swatterFrigateAdd  .setText(this.values.config.frigates.swatter.rating   +"r\nSwatter\n"   +this.values.config.frigates.swatter.cost    +"CU")
    this.buttons.bastionFrigateAdd  .setText(this.values.config.frigates.bastion.rating   +"r\nBastion\n"   +this.values.config.frigates.bastion.cost    +"CU")
    this.buttons.slammerFrigateAdd  .setText(this.values.config.frigates.slammer.rating   +"r\nSlammer\n"   +this.values.config.frigates.slammer.cost    +"CU")
    this.buttons.leviathanCruiserAdd.setText(this.values.config.cruisers.leviathan.rating +"r\nLeviathan\n" +this.values.config.cruisers.leviathan.cost  +"CU")
    this.buttons.hunterCruiserAdd   .setText(this.values.config.cruisers.hunter.rating    +"r\nHunter\n"    +this.values.config.cruisers.hunter.cost     +"CU")


    this.buttons.fighterButton          .setInteractive().on("pointerdown", ()=>{this.setFighterMenu(true);})
    this.buttons.lightFighterAdd        .setInteractive().on("pointerdown", ()=>{this.changeLightFighter(1);})
    this.buttons.lightFighterRemove     .setInteractive().on("pointerdown", ()=>{this.changeLightFighter(-1);})
    this.buttons.heavyFighterAdd        .setInteractive().on("pointerdown", ()=>{this.changeHeavyFighter(1);})
    this.buttons.heavyFighterRemove     .setInteractive().on("pointerdown", ()=>{this.changeHeavyFighter(-1);})

    this.buttons.frigateButton          .setInteractive().on("pointerdown", ()=>{this.setFrigateMenu(true);})
    this.buttons.swatterFrigateAdd      .setInteractive().on("pointerdown", ()=>{this.changeSwatterFrigate(1);})
    this.buttons.swatterFrigateRemove   .setInteractive().on("pointerdown", ()=>{this.changeSwatterFrigate(-1);})
    this.buttons.bastionFrigateAdd      .setInteractive().on("pointerdown", ()=>{this.changeBastionFrigate(1);})
    this.buttons.bastionFrigateRemove   .setInteractive().on("pointerdown", ()=>{this.changeBastionFrigate(-1);})
    this.buttons.slammerFrigateAdd      .setInteractive().on("pointerdown", ()=>{this.changeSlammerFrigate(1);})
    this.buttons.slammerFrigateRemove   .setInteractive().on("pointerdown", ()=>{this.changeSlammerFrigate(-1);})

    this.buttons.cruiserButton          .setInteractive().on("pointerdown", ()=>{this.setCruiserMenu(true);})
    this.buttons.hunterCruiserAdd       .setInteractive().on("pointerdown", ()=>{this.changeHunterCruiser(1);})
    this.buttons.hunterCruiserRemove    .setInteractive().on("pointerdown", ()=>{this.changeHunterCruiser(-1);})
    this.buttons.leviathanCruiserAdd    .setInteractive().on("pointerdown", ()=>{this.changeLeviathanCruiser(1);})
    this.buttons.leviathanCruiserRemove .setInteractive().on("pointerdown", ()=>{this.changeLeviathanCruiser(-1);})


    this.buttons.launchButton = new CircleLabelButton(this,"Launch", this.textStyles.main, 1, 60, 100, 50, 0xff00ff, 1)
    this.buttons.launchButton.setOrigin(0.5,0.5)
    this.buttons.launchButton.setInteractive().on("pointerdown", ()=>{
      this.launchFormation()
    });
    // scene,text,textStyle,textalpha,x,y,width,height,fillColor,fillAlpha
    this.buttons.formationCapacityCount = new RectLabelButton(this,"Units: 0/30"  , this.textStyles.sub, 1, 190, 70 , 130, 30, 0x0000ff, 1)
    this.buttons.formationRating        = new RectLabelButton(this,"Rating: 0/180", this.textStyles.sub, 1, 190, 100 , 130, 30, 0x0000ff, 1)
    this.buttons.formationCost          = new RectLabelButton(this,"Cost: 0 CU"   , this.textStyles.sub, 1, 190, 130, 130, 30, 0x0000ff, 1)

    this.buttons.constructionUnitsLabel = new RectLabelButton(this,"0 CU"         , this.textStyles.sub, 1, 75 , 25 , 130, 30, 0x0000ff, 1)

    this.setSelectorMenu(false)
    this.setFighterMenu(false)
    this.setFrigateMenu(false)
    this.setCruiserMenu(false)
  }

  changeLightFighter(value){
    var newValue = this.values.factory.fighters.light + value
    var newRating = this.values.factory.rating + (this.values.config.fighters.light.rating * value)
    var newCost = this.values.factory.cost + (this.values.config.fighters.light.cost * value)
    var newCapacity = this.values.factory.capacity + value
    console.log(newCost, this.values.game.constructionUnits);
    if(newRating > this.values.config.formation.maxRating || newCapacity > this.values.config.formation.maxCapacity || newCost > this.values.game.constructionUnits){
      return
    }
    if(newValue < 0){
      return
    }
    this.values.factory.fighters.light = newValue
    this.values.factory.capacity = newCapacity
    this.values.factory.rating = newRating
    this.values.factory.cost = newCost
    this.updateLabels()
  }
  changeHeavyFighter(value){
    var newValue = this.values.factory.fighters.heavy + value
    var newRating = this.values.factory.rating + (this.values.config.fighters.heavy.rating  * value)
    var newCost = this.values.factory.cost + (this.values.config.fighters.heavy.cost * value)
    var newCapacity = this.values.factory.capacity + value
    if(newRating > this.values.config.formation.maxRating || newCapacity > this.values.config.formation.maxCapacity || newCost > this.values.game.constructionUnits){
      return
    }
    if(newValue < 0){
      return
    }
    this.values.factory.fighters.heavy = newValue
    this.values.factory.capacity = newCapacity
    this.values.factory.rating = newRating
    this.values.factory.cost = newCost
    this.updateLabels()
  }
  changeSwatterFrigate(value){
    var newValue = this.values.factory.frigates.swatter + value
    var newRating = this.values.factory.rating + (this.values.config.frigates.swatter.rating * value)
    var newCost = this.values.factory.cost + (this.values.config.frigates.swatter.cost * value)
    var newCapacity = this.values.factory.capacity + value
    if(newRating > this.values.config.formation.maxRating || newCapacity > this.values.config.formation.maxCapacity || newCost > this.values.game.constructionUnits){
      return
    }
    if(newValue < 0){
      return
    }
    this.values.factory.frigates.swatter = newValue
    this.values.factory.capacity = newCapacity
    this.values.factory.rating = newRating
    this.values.factory.cost = newCost
    this.updateLabels()
  }
  changeBastionFrigate(value){
    var newValue = this.values.factory.frigates.bastion + value
    var newRating = this.values.factory.rating + (this.values.config.frigates.bastion.rating * value)
    var newCost = this.values.factory.cost + (this.values.config.frigates.bastion.cost * value)
    var newCapacity = this.values.factory.capacity + value
    if(newRating > this.values.config.formation.maxRating || newCapacity > this.values.config.formation.maxCapacity || newCost > this.values.game.constructionUnits){
      return
    }
    if(newValue < 0){
      return
    }
    this.values.factory.frigates.bastion = newValue
    this.values.factory.capacity = newCapacity
    this.values.factory.rating = newRating
    this.values.factory.cost = newCost
    this.updateLabels()
  }
  changeSlammerFrigate(value){
    var newValue = this.values.factory.frigates.slammer + value
    var newRating = this.values.factory.rating + (this.values.config.frigates.slammer.rating * value)
    var newCost = this.values.factory.cost + (this.values.config.frigates.slammer.cost * value)
    var newCapacity = this.values.factory.capacity + value
    if(newRating > this.values.config.formation.maxRating || newCapacity > this.values.config.formation.maxCapacity || newCost > this.values.game.constructionUnits){
      return
    }
    if(newValue < 0){
      return
    }
    this.values.factory.frigates.slammer = newValue
    this.values.factory.capacity = newCapacity
    this.values.factory.rating = newRating
    this.values.factory.cost = newCost
    this.updateLabels()
  }
  changeHunterCruiser(value){
    var newValue = this.values.factory.cruisers.hunter + value
    var newRating = this.values.factory.rating + (this.values.config.cruisers.hunter.rating * value)
    // var newCapacity = this.values.factory.capacity + value
    // if(newRating > this.values.config.formation.maxRating || newCapacity > this.values.config.formation.maxCapacity){
    var newCost = this.values.factory.cost + (this.values.config.cruisers.hunter.cost * value)
    if(newRating > this.values.config.formation.maxRating || newCost > this.values.game.constructionUnits){
      return;
    }
    if(newValue < 0){
      return
    }
    this.values.factory.cruisers.hunter = newValue
    // this.values.factory.capacity = newCapacity
    this.values.factory.rating = newRating
    this.values.factory.cost = newCost
    this.updateLabels()
  }
  changeLeviathanCruiser(value){
    var newValue = this.values.factory.cruisers.leviathan + value
    var newRating = this.values.factory.rating + (this.values.config.cruisers.leviathan.rating * value)
    // var newCapacity = this.values.factory.capacity + value
    // if(newRating > this.values.config.formation.maxRating || newCapacity > this.values.config.formation.maxCapacity){
    var newCost = this.values.factory.cost + (this.values.config.cruisers.leviathan.cost * value)
    if(newRating > this.values.config.formation.maxRating || newCost > this.values.game.constructionUnits){
      return;
    }
    if(newValue < 0){
      return
    }
    this.values.factory.cruisers.leviathan = newValue
    // this.values.factory.capacity = newCapacity
    this.values.factory.rating = newRating
    this.values.factory.cost = newCost
    this.updateLabels()
  }

  launchFormation(){
    console.log("launch");
    this.values.factory.fighters.light     = 0
    this.values.factory.fighters.heavy     = 0
    this.values.factory.frigates.swatter   = 0
    this.values.factory.frigates.bastion   = 0
    this.values.factory.frigates.slammer   = 0
    this.values.factory.cruisers.hunter    = 0
    this.values.factory.cruisers.leviathan = 0
    this.values.factory.capacity           = 0
    this.values.factory.rating             = 0
    this.values.factory.cost               = 0
    this.updateLabels()
    if(this.values.factory.open){
    this.values.factory.open = false
      this.setSelectorMenu(false)
      this.setFighterMenu(false)
      this.setFrigateMenu(false)
      this.setCruiserMenu(false)
    }
  }

  updateLabels(){
    console.log(this.buttons.factoryButton);
    console.log(this.values.factory.rating);
    this.buttons.lightFighterLabel      .setText(this.values.factory.fighters.light)
    this.buttons.heavyFighterLabel      .setText(this.values.factory.fighters.heavy)
    this.buttons.swatterFrigateLabel    .setText(this.values.factory.frigates.swatter)
    this.buttons.bastionFrigateLabel    .setText(this.values.factory.frigates.bastion)
    this.buttons.slammerFrigateLabel    .setText(this.values.factory.frigates.slammer)
    this.buttons.hunterCruiserLabel     .setText(this.values.factory.cruisers.hunter)
    this.buttons.leviathanCruiserLabel  .setText(this.values.factory.cruisers.leviathan)

    this.buttons.formationCapacityCount .setText("Units: "+ this.values.factory.capacity + "/30").setColor(this.values.factory.capacity == this.values.config.formation.maxCapacity ? "#ff2222" : "#ffffff")
    this.buttons.formationRating        .setText("Rating: "+ this.values.factory.rating + "/180").setColor(this.values.factory.rating   == this.values.config.formation.maxRating   ? "#ff2222" : "#ffffff")
    this.buttons.formationCost          .setText("Cost: "+ this.values.factory.cost + " CU")     .setColor(this.values.factory.cost     >=  this.values.game.constructionUnits      ? "#ff2222" : "#ffffff")

    this.buttons.lightFighterAdd    .setColor(this.values.factory.capacity + 1 > 30 || this.values.factory.cost + this.values.config.fighters.light.cost     > this.values.game.constructionUnits || this.values.factory.rating + this.values.config.fighters.light.rating     > this.values.config.formation.maxRating ? "#ff2222" : "#ffffff")
    this.buttons.heavyFighterAdd    .setColor(this.values.factory.capacity + 1 > 30 || this.values.factory.cost + this.values.config.fighters.heavy.cost     > this.values.game.constructionUnits || this.values.factory.rating + this.values.config.fighters.heavy.rating     > this.values.config.formation.maxRating ? "#ff2222" : "#ffffff")
    this.buttons.swatterFrigateAdd  .setColor(this.values.factory.capacity + 1 > 30 || this.values.factory.cost + this.values.config.frigates.swatter.cost   > this.values.game.constructionUnits || this.values.factory.rating + this.values.config.frigates.swatter.rating   > this.values.config.formation.maxRating ? "#ff2222" : "#ffffff")
    this.buttons.bastionFrigateAdd  .setColor(this.values.factory.capacity + 1 > 30 || this.values.factory.cost + this.values.config.frigates.bastion.cost   > this.values.game.constructionUnits || this.values.factory.rating + this.values.config.frigates.bastion.rating   > this.values.config.formation.maxRating ? "#ff2222" : "#ffffff")
    this.buttons.slammerFrigateAdd  .setColor(this.values.factory.capacity + 1 > 30 || this.values.factory.cost + this.values.config.frigates.slammer.cost   > this.values.game.constructionUnits || this.values.factory.rating + this.values.config.frigates.slammer.rating   > this.values.config.formation.maxRating ? "#ff2222" : "#ffffff")
    this.buttons.leviathanCruiserAdd.setColor(this.values.factory.capacity + 1 > 30 || this.values.factory.cost + this.values.config.cruisers.leviathan.cost > this.values.game.constructionUnits || this.values.factory.rating + this.values.config.cruisers.leviathan.rating > this.values.config.formation.maxRating ? "#ff2222" : "#ffffff")
    this.buttons.hunterCruiserAdd   .setColor(this.values.factory.capacity + 1 > 30 || this.values.factory.cost + this.values.config.cruisers.hunter.cost    > this.values.game.constructionUnits || this.values.factory.rating + this.values.config.cruisers.hunter.rating    > this.values.config.formation.maxRating ? "#ff2222" : "#ffffff")
  }

  setSelectorMenu(value){
    this.buttons.fighterButton          .setVisible(value)
    this.buttons.frigateButton          .setVisible(value)
    this.buttons.cruiserButton          .setVisible(value)
    this.buttons.launchButton           .setVisible(value)
    this.buttons.formationCapacityCount .setVisible(value)
    this.buttons.formationRating        .setVisible(value)
    this.buttons.formationCost          .setVisible(value)
  }
  setFighterMenu(value){
    this.buttons.lightFighterAdd       .setVisible(value)
    this.buttons.lightFighterRemove    .setVisible(value)
    this.buttons.lightFighterLabel     .setVisible(this.values.factory.open)
    this.buttons.heavyFighterAdd       .setVisible(value)
    this.buttons.heavyFighterRemove    .setVisible(value)
    this.buttons.heavyFighterLabel     .setVisible(this.values.factory.open)
    if(value){
      this.setFrigateMenu(false)
      this.setCruiserMenu(false)
    }
  }
  setFrigateMenu(value){
    this.buttons.swatterFrigateAdd    .setVisible(value)
    this.buttons.swatterFrigateRemove .setVisible(value)
    this.buttons.swatterFrigateLabel  .setVisible(this.values.factory.open)
    this.buttons.bastionFrigateAdd    .setVisible(value)
    this.buttons.bastionFrigateRemove .setVisible(value)
    this.buttons.bastionFrigateLabel  .setVisible(this.values.factory.open)
    this.buttons.slammerFrigateAdd    .setVisible(value)
    this.buttons.slammerFrigateRemove .setVisible(value)
    this.buttons.slammerFrigateLabel  .setVisible(this.values.factory.open)
    if(value){
      this.setFighterMenu(false)
      this.setCruiserMenu(false)
    }
  }
  setCruiserMenu(value){
    this.buttons.hunterCruiserAdd       .setVisible(value)
    this.buttons.hunterCruiserRemove    .setVisible(value)
    this.buttons.hunterCruiserLabel     .setVisible(this.values.factory.open)
    this.buttons.leviathanCruiserAdd    .setVisible(value)
    this.buttons.leviathanCruiserRemove .setVisible(value)
    this.buttons.leviathanCruiserLabel  .setVisible(this.values.factory.open)
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
  setInteractive(interfaceComponentconfig, inputConfig){
    this.body.setInteractive(inputConfig)
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
    // console.log(this.hitGeom);
    // config = config || {}
    // config.hitArea = this.hitGeom
    // this.body.setInteractive(this.hitGeom,(hitArea,x,y,gameObject)=>{
    //   console.log(hitArea,x,y,gameObject);
    //   var r = Phaser.Geom.Circle.Contains(hitArea,x,y)
    //   console.log(r);
    // })
    // console.log(this.body.input);

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
