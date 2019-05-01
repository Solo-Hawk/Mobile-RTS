class BaseNode extends Steerable{
  constructor(scene, x, y, texture, team, offsetX, offsetY){
    super(scene, x, y, texture)
    this.team = team;
    this.setScale(4)

    this.type = "base"

    this.body.offset.x = (this.width * 4)/2
    this.body.offset.y = (this.height * 4)/2

    this.spawnOffsetX = offsetX
    this.spawnOffsetY = offsetY

    this.target = 1

    this.maxLinearSpeed         = 0;
    this.maxLinearAcceleration  = 0;
    console.log(scene);
    this.formation = scene.gameManager.create.formation(this.team, [this])
  }
  getSpawnPoint(){
    return this.getPosition().add({x: this.spawnOffsetX + Phaser.Math.Between(-400,400), y: this.spawnOffsetY + Phaser.Math.Between(-400,400)})
  }
  setTarget(){

  }
}
