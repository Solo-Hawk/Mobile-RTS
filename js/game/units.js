console.log("Unit Class Loaded");

class Interactable extends Phaser.GameObjects.Sprite{


  constructor(gameManager, scene, x, y, texture, type){
    super(scene, x, y, texture)
    this.type = type || "interactable"
    this.scene = scene
    this.scene.add.existing(this)
    this.setOrigin(0.5, 0.5)
    this.scene.impact.add.existing(this)

    this.setInteractive().on("pointerdown", ()=>{
      console.log(this);
      gameManager.userInterface.events.emit("set-focus",this);}, gameManager.userInterface)

  }


}
