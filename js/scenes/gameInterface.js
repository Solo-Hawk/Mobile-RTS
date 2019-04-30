class GameInterface extends Phaser.Scene{
  constructor(){
    super("game-interface");
  }

  init(gameScene){
    this.gameScene = gameScene;
    console.log(this.gameScene, "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    this.textStyles = {
        main:{
          fontSize: '40px',
          fontFamily: 'Trebuchet MS',
          color: '#ffffff',
          align: 'center'},
        sub:{
          fontSize: '24px',
          fontFamily: 'Trebuchet MS',
          color: '#ffffff',
          align: 'center'
        },
        description:{
          fontSize: '22px',
          fontFamily: 'Trebuchet MS',
          color: '#ffffff',
          align: 'center'
        },
        remove:{
          fontSize: '80px',
          fontFamily: 'Trebuchet MS',
          color: '#ffffff',
          align: 'center'
        },
        count:{
          fontSize: '40px',
          fontFamily: 'Trebuchet MS',
          color: '#ffffff',
          align: 'center'
        }
      }
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
    this.ui = {}
  }

  preload(){

  }

  create(){
    console.log("HERE");


    this.events.on("set-focus", (interfaceComponent)=>{
      this.setFocus(interfaceComponent)
    }, this)
    this.createGameUI()
    this.createControlPanelUI()
    this.createFactoryUI()
    this.closeControlPanel()
  }

  update(delta, time){
    this.ui.game.constructionUnitsLabel.setText(this.values.game.constructionUnits+" CU")
  }

  setFocus(context){
    console.log(context);
    console.log(context.type);
    switch (context.type) {
      case "unit":
        if(context.team != Game.Utils.statics.teams.PLAYER){
          console.log("NOT PLAYER"); return
        }
        this.openControlPanel(this.getFormationData(context.formation))

        break;

    }

  }
  createGameUI(){
    this.ui.game = {}
    this.ui.game.constructionUnitsLabel = new RectLabelButton(this,"0 CU"         , this.textStyles.sub, 1, 105 , 40 , 180, 40, 0x007777, 1)
  }
  createControlPanelUI(){
    this.ui.unitPanel = {}
    this.ui.unitPanel.panel = this.add.rectangle(config.width/2 , config.height - 115, 1600, 230, 0x8888ff,1)
    this.ui.unitPanel.deselectButton = new RectLabelButton(this, "Deselect", this.textStyles.main,1,(config.width/2)+700,config.height - 115, 200,230,0xaaaaaa,1)
    this.ui.unitPanel.deselectButton.setOrigin(0.5,0.5)
    this.ui.unitPanel.deselectButton.setInteractive().on("pointerdown", ()=>{
      this.closeControlPanel()
    })
    this.ui.unitPanel.item1 = new RectLabelButton(this,""  , this.textStyles.main, 1, config.width/2 - 600, config.height - 200, 400, 60, 0x0000ff, 1)
    this.ui.unitPanel.item2 = new RectLabelButton(this,""  , this.textStyles.main, 1, config.width/2 - 600, config.height - 120, 400, 60, 0x0000ff, 1)
    this.ui.unitPanel.item3 = new RectLabelButton(this,""  , this.textStyles.main, 1, config.width/2 - 600, config.height - 40, 400, 60, 0x0000ff, 1)
  }

  openControlPanel(context){
    console.log("Open");
    this.setControlPanelContext(context)
    this.ui.unitPanel.panel.setVisible(true)
    this.ui.unitPanel.deselectButton.setVisible(true)
    this.ui.unitPanel.item1.setVisible(true)
    this.ui.unitPanel.item2.setVisible(true)
    this.ui.unitPanel.item3.setVisible(true)
  }
  getFormationData(formation){
    return ["Unit Count: ", formation.ships.length]
  }
  setControlPanelContext(context){
    this.ui.unitPanel.item1.setText(context[0] + context[1])

  }


  closeControlPanel(){
    console.log("Closing");
    this.ui.unitPanel.panel.setVisible(false)
    this.ui.unitPanel.deselectButton.setVisible(false)
    this.ui.unitPanel.item1.setVisible(false)
    this.ui.unitPanel.item2.setVisible(false)
    this.ui.unitPanel.item3.setVisible(false)
  }

  createFactoryUI(){
    this.ui.factory = {}
    //Factory UI Button System
    var x = 10;
    console.log(this);
    var y = config.height - 10;


    this.ui.factory.factoryButton = new CircleLabelButton(this,"Build", this.textStyles.main, 1, x, y, 220, 0x0000ff, 1)
    this.ui.factory.factoryButton.setOrigin(-0.25,1.50)
    this.ui.factory.factoryButton.setInteractive().on("pointerdown", ()=>{
      if(this.values.factory.open){
        this.events.emit("set-focus", {type:"unit-factory"})
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



    this.ui.factory.fighterButton               = new CircleLabelButton(this, "Fighters", this.textStyles.sub        , 1, x+75        , y-300        , 80, 0x0000ff, 1)
    var fib={x: this.ui.factory.fighterButton.x, y: this.ui.factory.fighterButton.y}

    this.ui.factory.lightFighterAdd             = new CircleLabelButton(this,""         , this.textStyles.description, 1, fib.x       , fib.y-160    , 60, 0x0000ff, 1)
    this.ui.factory.lightFighterRemove          = new CircleLabelButton(this, "-"       , this.textStyles.remove     , 1, fib.x+70    , fib.y-160-70 , 34, 0xff0000, 1)
    this.ui.factory.lightFighterLabel           = new CircleLabelButton(this, "0"       , this.textStyles.count      , 1, fib.x       , fib.y-60     , 20, 0xff0000, 0)

    this.ui.factory.heavyFighterAdd             = new CircleLabelButton(this, ""        , this.textStyles.description, 1, fib.x+120   , fib.y-96     , 60, 0x0000ff, 1)
    this.ui.factory.heavyFighterRemove          = new CircleLabelButton(this, "-"       , this.textStyles.remove     , 1, fib.x+120+70, fib.y-96-70  , 34, 0xff0000, 1)
    this.ui.factory.heavyFighterLabel           = new CircleLabelButton(this, "0"       , this.textStyles.count      , 1, fib.x+48    , fib.y-34     , 20, 0xff0000, 0)


    this.ui.factory.frigateButton               = new CircleLabelButton(this, "Frigates", this.textStyles.sub        , 1, x+220       , y-220        , 80, 0x0000ff, 1)
    var frb={x: this.ui.factory.frigateButton.x, y: this.ui.factory.frigateButton.y}

    this.ui.factory.swatterFrigateAdd           = new CircleLabelButton(this, ""        , this.textStyles.description, 1, frb.x       , frb.y-160    , 60, 0x0000ff, 1)
    this.ui.factory.swatterFrigateRemove        = new CircleLabelButton(this, "-"       , this.textStyles.remove     , 1, frb.x+70    , frb.y-160-70 , 34, 0xff0000, 1)
    this.ui.factory.swatterFrigateLabel         = new CircleLabelButton(this, "0"       , this.textStyles.count      , 1, frb.x       , frb.y-60     , 20, 0xff0000, 0)

    this.ui.factory.bastionFrigateAdd           = new CircleLabelButton(this, ""        , this.textStyles.description, 1, frb.x+114    , frb.y-114   , 60, 0x0000ff, 1)
    this.ui.factory.bastionFrigateRemove        = new CircleLabelButton(this, "-"       , this.textStyles.remove     , 1, frb.x+114+70 , frb.y-114-70, 34, 0xff0000, 1)
    this.ui.factory.bastionFrigateLabel         = new CircleLabelButton(this, "0"       , this.textStyles.count      , 1, frb.x+40    , frb.y-40     , 20, 0xff0000, 0)

    this.ui.factory.slammerFrigateAdd           = new CircleLabelButton(this, ""        , this.textStyles.description, 1, frb.x+160   , frb.y        , 60, 0x0000ff, 1)
    this.ui.factory.slammerFrigateRemove        = new CircleLabelButton(this, "-"       , this.textStyles.remove     , 1, frb.x+160+70, frb.y-70     , 34, 0xff0000, 1)
    this.ui.factory.slammerFrigateLabel         = new CircleLabelButton(this, "0"       , this.textStyles.count      , 1, frb.x+60    , frb.y        , 20, 0xff0000, 0)


    this.ui.factory.cruiserButton               = new CircleLabelButton(this, "Cruisers", this.textStyles.sub        , 1, x+300       , y-75         , 80, 0x0000ff, 1)
    var crb={x: this.ui.factory.cruiserButton.x, y: this.ui.factory.cruiserButton.y}

    this.ui.factory.leviathanCruiserAdd         = new CircleLabelButton(this, ""        , this.textStyles.description, 1, crb.x+96    , crb.y-120    , 60, 0x0000ff, 1)
    this.ui.factory.leviathanCruiserRemove      = new CircleLabelButton(this, "-"       , this.textStyles.remove     , 1, crb.x+96+70 , crb.y-120-70 , 34, 0xff0000, 1)
    this.ui.factory.leviathanCruiserLabel       = new CircleLabelButton(this, "0"       , this.textStyles.count      , 1, crb.x+34    , crb.y-58     , 20, 0xff0000, 0)

    this.ui.factory.hunterCruiserAdd            = new CircleLabelButton(this, ""        , this.textStyles.description, 1, crb.x+160   , crb.y        , 60, 0x0000ff, 1)
    this.ui.factory.hunterCruiserRemove         = new CircleLabelButton(this, "-"       , this.textStyles.remove     , 1, crb.x+160+70, crb.y-70     , 34, 0xff0000, 1)
    this.ui.factory.hunterCruiserLabel          = new CircleLabelButton(this, "0"       , this.textStyles.count      , 1, crb.x+60    , crb.y        , 20, 0xff0000, 0)


    this.ui.factory.lightFighterAdd    .setText(this.values.config.fighters.light.rating     +"r\nLight\n"     +this.values.config.fighters.light.cost      +"CU")
    this.ui.factory.heavyFighterAdd    .setText(this.values.config.fighters.heavy.rating     +"r\nHeavy\n"     +this.values.config.fighters.heavy.cost      +"CU")
    this.ui.factory.swatterFrigateAdd  .setText(this.values.config.frigates.swatter.rating   +"r\nSwatter\n"   +this.values.config.frigates.swatter.cost    +"CU")
    this.ui.factory.bastionFrigateAdd  .setText(this.values.config.frigates.bastion.rating   +"r\nBastion\n"   +this.values.config.frigates.bastion.cost    +"CU")
    this.ui.factory.slammerFrigateAdd  .setText(this.values.config.frigates.slammer.rating   +"r\nSlammer\n"   +this.values.config.frigates.slammer.cost    +"CU")
    this.ui.factory.leviathanCruiserAdd.setText(this.values.config.cruisers.leviathan.rating +"r\nLeviathan\n" +this.values.config.cruisers.leviathan.cost  +"CU")
    this.ui.factory.hunterCruiserAdd   .setText(this.values.config.cruisers.hunter.rating    +"r\nHunter\n"    +this.values.config.cruisers.hunter.cost     +"CU")


    this.ui.factory.fighterButton          .setInteractive().on("pointerdown", ()=>{this.setFighterMenu(true);})
    this.ui.factory.lightFighterAdd        .setInteractive().on("pointerdown", ()=>{this.changeLightFighter(1);})
    this.ui.factory.lightFighterRemove     .setInteractive().on("pointerdown", ()=>{this.changeLightFighter(-1);})
    this.ui.factory.heavyFighterAdd        .setInteractive().on("pointerdown", ()=>{this.changeHeavyFighter(1);})
    this.ui.factory.heavyFighterRemove     .setInteractive().on("pointerdown", ()=>{this.changeHeavyFighter(-1);})

    this.ui.factory.frigateButton          .setInteractive().on("pointerdown", ()=>{this.setFrigateMenu(true);})
    this.ui.factory.swatterFrigateAdd      .setInteractive().on("pointerdown", ()=>{this.changeSwatterFrigate(1);})
    this.ui.factory.swatterFrigateRemove   .setInteractive().on("pointerdown", ()=>{this.changeSwatterFrigate(-1);})
    this.ui.factory.bastionFrigateAdd      .setInteractive().on("pointerdown", ()=>{this.changeBastionFrigate(1);})
    this.ui.factory.bastionFrigateRemove   .setInteractive().on("pointerdown", ()=>{this.changeBastionFrigate(-1);})
    this.ui.factory.slammerFrigateAdd      .setInteractive().on("pointerdown", ()=>{this.changeSlammerFrigate(1);})
    this.ui.factory.slammerFrigateRemove   .setInteractive().on("pointerdown", ()=>{this.changeSlammerFrigate(-1);})

    this.ui.factory.cruiserButton          .setInteractive().on("pointerdown", ()=>{this.setCruiserMenu(true);})
    this.ui.factory.hunterCruiserAdd       .setInteractive().on("pointerdown", ()=>{this.changeHunterCruiser(1);})
    this.ui.factory.hunterCruiserRemove    .setInteractive().on("pointerdown", ()=>{this.changeHunterCruiser(-1);})
    this.ui.factory.leviathanCruiserAdd    .setInteractive().on("pointerdown", ()=>{this.changeLeviathanCruiser(1);})
    this.ui.factory.leviathanCruiserRemove .setInteractive().on("pointerdown", ()=>{this.changeLeviathanCruiser(-1);})

    this.ui.factory.launchButton = new CircleLabelButton(this,"Launch", this.textStyles.main, 1, 110, 170, 90, 0xff00ff, 1)
    this.ui.factory.launchButton.setOrigin(0.5,0.5)
    this.ui.factory.launchButton.setInteractive().on("pointerdown", ()=>{
      this.launchFormation()
    });
    this.ui.factory.formationCapacityCount = new RectLabelButton(this,"Units: 0/30"  , this.textStyles.sub, 1, 105, 300, 180, 40, 0x0000ff, 1)
    this.ui.factory.formationRating        = new RectLabelButton(this,"Rating: 0/180", this.textStyles.sub, 1, 105, 340, 180, 40, 0x0000ff, 1)
    this.ui.factory.formationCost          = new RectLabelButton(this,"Cost: 0 CU"   , this.textStyles.sub, 1, 105, 380, 180, 40, 0x0000ff, 1)


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
    // TODO: Call gamemanager and create formation
    var formation = this.gameScene.gameManager.create.formation(Game.Utils.statics.teams.PLAYER)
    for(var i = 0; i < this.values.factory.fighters.light; i++){
      var unit = this.gameScene.gameManager.create.lightFighter(Game.Utils.statics.teams.PLAYER, Phaser.Math.Between(-300, 300),Phaser.Math.Between(-300, 300))
      formation.addUnit(unit)
    }
    for(var i = 0; i < this.values.factory.fighters.heavy; i++){
      var unit = this.gameScene.gameManager.create.heavyFighter(Game.Utils.statics.teams.PLAYER, Phaser.Math.Between(-300, 300),Phaser.Math.Between(-300, 300))
      formation.addUnit(unit)
    }

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
    // This is hardcoded for simplicity, I wrote most of this in mind with multicursor so the time it took is minimal compared to making it flexible code
    console.log(this.ui.factory.factoryButton);
    console.log(this.values.factory.rating);
    this.ui.factory.lightFighterLabel      .setText(this.values.factory.fighters.light)
    this.ui.factory.heavyFighterLabel      .setText(this.values.factory.fighters.heavy)
    this.ui.factory.swatterFrigateLabel    .setText(this.values.factory.frigates.swatter)
    this.ui.factory.bastionFrigateLabel    .setText(this.values.factory.frigates.bastion)
    this.ui.factory.slammerFrigateLabel    .setText(this.values.factory.frigates.slammer)
    this.ui.factory.hunterCruiserLabel     .setText(this.values.factory.cruisers.hunter)
    this.ui.factory.leviathanCruiserLabel  .setText(this.values.factory.cruisers.leviathan)

    this.ui.factory.formationCapacityCount .setText("Units: "+ this.values.factory.capacity + "/30").setColor(this.values.factory.capacity == this.values.config.formation.maxCapacity ? "#ff2222" : "#ffffff")
    this.ui.factory.formationRating        .setText("Rating: "+ this.values.factory.rating + "/180").setColor(this.values.factory.rating   == this.values.config.formation.maxRating   ? "#ff2222" : "#ffffff")
    this.ui.factory.formationCost          .setText("Cost: "+ this.values.factory.cost + " CU")     .setColor(this.values.factory.cost     >=  this.values.game.constructionUnits      ? "#ff2222" : "#ffffff")

    this.ui.factory.fighterButton.setColor(
      (this.values.factory.capacity + 1 > 30 || this.values.factory.cost + this.values.config.fighters.light.cost     > this.values.game.constructionUnits || this.values.factory.rating + this.values.config.fighters.light.rating     > this.values.config.formation.maxRating)&&
      (this.values.factory.capacity + 1 > 30 || this.values.factory.cost + this.values.config.fighters.heavy.cost     > this.values.game.constructionUnits || this.values.factory.rating + this.values.config.fighters.heavy.rating     > this.values.config.formation.maxRating)
      ? "#ff2222" : "#ffffff")
    this.ui.factory.frigateButton.setColor(
      (this.values.factory.capacity + 1 > 30 || this.values.factory.cost + this.values.config.frigates.swatter.cost   > this.values.game.constructionUnits || this.values.factory.rating + this.values.config.frigates.swatter.rating   > this.values.config.formation.maxRating)&&
      (this.values.factory.capacity + 1 > 30 || this.values.factory.cost + this.values.config.frigates.bastion.cost   > this.values.game.constructionUnits || this.values.factory.rating + this.values.config.frigates.bastion.rating   > this.values.config.formation.maxRating)&&
      (this.values.factory.capacity + 1 > 30 || this.values.factory.cost + this.values.config.frigates.slammer.cost   > this.values.game.constructionUnits || this.values.factory.rating + this.values.config.frigates.slammer.rating   > this.values.config.formation.maxRating)
      ? "#ff2222" : "#ffffff")
    this.ui.factory.cruiserButton.setColor(
      (this.values.factory.capacity + 1 > 30 || this.values.factory.cost + this.values.config.cruisers.leviathan.cost > this.values.game.constructionUnits || this.values.factory.rating + this.values.config.cruisers.leviathan.rating > this.values.config.formation.maxRating)&&
      (this.values.factory.capacity + 1 > 30 || this.values.factory.cost + this.values.config.cruisers.hunter.cost    > this.values.game.constructionUnits || this.values.factory.rating + this.values.config.cruisers.hunter.rating    > this.values.config.formation.maxRating)
      ? "#ff2222" : "#ffffff"
    )

    this.ui.factory.lightFighterAdd    .setColor(this.values.factory.capacity + 1 > 30 || this.values.factory.cost + this.values.config.fighters.light.cost     > this.values.game.constructionUnits || this.values.factory.rating + this.values.config.fighters.light.rating     > this.values.config.formation.maxRating ? "#ff2222" : "#ffffff")
    this.ui.factory.heavyFighterAdd    .setColor(this.values.factory.capacity + 1 > 30 || this.values.factory.cost + this.values.config.fighters.heavy.cost     > this.values.game.constructionUnits || this.values.factory.rating + this.values.config.fighters.heavy.rating     > this.values.config.formation.maxRating ? "#ff2222" : "#ffffff")
    this.ui.factory.swatterFrigateAdd  .setColor(this.values.factory.capacity + 1 > 30 || this.values.factory.cost + this.values.config.frigates.swatter.cost   > this.values.game.constructionUnits || this.values.factory.rating + this.values.config.frigates.swatter.rating   > this.values.config.formation.maxRating ? "#ff2222" : "#ffffff")
    this.ui.factory.bastionFrigateAdd  .setColor(this.values.factory.capacity + 1 > 30 || this.values.factory.cost + this.values.config.frigates.bastion.cost   > this.values.game.constructionUnits || this.values.factory.rating + this.values.config.frigates.bastion.rating   > this.values.config.formation.maxRating ? "#ff2222" : "#ffffff")
    this.ui.factory.slammerFrigateAdd  .setColor(this.values.factory.capacity + 1 > 30 || this.values.factory.cost + this.values.config.frigates.slammer.cost   > this.values.game.constructionUnits || this.values.factory.rating + this.values.config.frigates.slammer.rating   > this.values.config.formation.maxRating ? "#ff2222" : "#ffffff")
    this.ui.factory.leviathanCruiserAdd.setColor(this.values.factory.capacity + 1 > 30 || this.values.factory.cost + this.values.config.cruisers.leviathan.cost > this.values.game.constructionUnits || this.values.factory.rating + this.values.config.cruisers.leviathan.rating > this.values.config.formation.maxRating ? "#ff2222" : "#ffffff")
    this.ui.factory.hunterCruiserAdd   .setColor(this.values.factory.capacity + 1 > 30 || this.values.factory.cost + this.values.config.cruisers.hunter.cost    > this.values.game.constructionUnits || this.values.factory.rating + this.values.config.cruisers.hunter.rating    > this.values.config.formation.maxRating ? "#ff2222" : "#ffffff")
  }

  setSelectorMenu(value){
    this.ui.factory.fighterButton          .setVisible(value)
    this.ui.factory.frigateButton          .setVisible(value)
    this.ui.factory.cruiserButton          .setVisible(value)
    this.ui.factory.launchButton           .setVisible(value)
    this.ui.factory.formationCapacityCount .setVisible(value)
    this.ui.factory.formationRating        .setVisible(value)
    this.ui.factory.formationCost          .setVisible(value)
  }
  setFighterMenu(value){
    this.ui.factory.lightFighterAdd       .setVisible(value)
    this.ui.factory.lightFighterRemove    .setVisible(value)
    this.ui.factory.lightFighterLabel     .setVisible(this.values.factory.open)
    this.ui.factory.heavyFighterAdd       .setVisible(value)
    this.ui.factory.heavyFighterRemove    .setVisible(value)
    this.ui.factory.heavyFighterLabel     .setVisible(this.values.factory.open)
    if(value){
      this.setFrigateMenu(false)
      this.setCruiserMenu(false)
    }
  }
  setFrigateMenu(value){
    this.ui.factory.swatterFrigateAdd    .setVisible(value)
    this.ui.factory.swatterFrigateRemove .setVisible(value)
    this.ui.factory.swatterFrigateLabel  .setVisible(this.values.factory.open)
    this.ui.factory.bastionFrigateAdd    .setVisible(value)
    this.ui.factory.bastionFrigateRemove .setVisible(value)
    this.ui.factory.bastionFrigateLabel  .setVisible(this.values.factory.open)
    this.ui.factory.slammerFrigateAdd    .setVisible(value)
    this.ui.factory.slammerFrigateRemove .setVisible(value)
    this.ui.factory.slammerFrigateLabel  .setVisible(this.values.factory.open)
    if(value){
      this.setFighterMenu(false)
      this.setCruiserMenu(false)
    }
  }
  setCruiserMenu(value){
    this.ui.factory.hunterCruiserAdd       .setVisible(value)
    this.ui.factory.hunterCruiserRemove    .setVisible(value)
    this.ui.factory.hunterCruiserLabel     .setVisible(this.values.factory.open)
    this.ui.factory.leviathanCruiserAdd    .setVisible(value)
    this.ui.factory.leviathanCruiserRemove .setVisible(value)
    this.ui.factory.leviathanCruiserLabel  .setVisible(this.values.factory.open)
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
