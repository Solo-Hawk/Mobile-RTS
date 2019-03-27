console.log("Unit Class Loaded");

class Interactable extends Phaser.GameObjects.Sprite{


  constructor(type, gameManager, scene, x, y, texture){
    super(scene, x, y, texture)
    this.type = type || "interactable"
  }

  
}
