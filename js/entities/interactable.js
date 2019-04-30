class Interactable extends Phaser.GameObjects.Sprite {

  constructor(scene, x, y, texture){
      super(scene, x, y, texture)
      this.scene = scene
      this.scene.add.existing(this)

      this.setOrigin(0.5, 0.5)
      this.scene.impact.add.existing(this)

      this.body.collides = Phaser.Physics.Impact.COLLIDES.NEVER

      this.setInteractive({useHandCursor:true}).on("pointerdown", ()=>{console.log(this.scene.GameInterface.setFocus(this));})
  }

}
