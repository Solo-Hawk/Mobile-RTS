class FactoryManager{

  constructor(gameManager){
    this.gameManager = gameManager;
    this.factory = new Factory(this)
  }

  add(){
    return this.factory
  }
  createFormation(config){

  }

}

class Factory{
  constructor(factoryManager){
    this.factoryManager = factoryManager;
    this.gameManager = this.factoryManager.gameManager
  }

  light(team, home){

  }
  heavy(team, home){

  }
  swatter(team, home){

  }
  bastion(team, home){

  }
  slammer(team, home){

  }
  leviathan(team, home){

  }
  hunter(team, home){

  }
}
