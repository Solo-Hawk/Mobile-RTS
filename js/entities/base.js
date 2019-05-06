class BaseNode extends Steerable{
  constructor(scene, x, y, texture, team, offsetX, offsetY){
    super(scene, x, y, texture)
    this.team = team;
    this.setScale(7)
    this.longest = this.width > this.height ? this.width * 7 : this.height * 7
    this.shortest = this.width < this.height ? this.width * 7 : this.height * 7
    this.type = "base"

    this.body.offset.x = (this.width * 7)/2
    this.body.offset.y = (this.height * 7)/2

    this.spawnOffsetX = offsetX
    this.spawnOffsetY = offsetY

    this.target = 1
    this.alive = true
    this.maxLinearSpeed         = 0;
    this.maxLinearAcceleration  = 0;
    console.log(scene);
    this.formation = scene.gameManager.create.formation(this.team, [this])
    this.width = this.width * 5
    this.height = this.height * 5

    this.maxHealth = 1
    this.health = this.maxHealth
  }
  update(){
    this.rotation = this.rotation + (1 / 60)
  }
  getSpawnPoint(){
    return this.getPosition().add({x: this.spawnOffsetX + Phaser.Math.Between(-400,400), y: this.spawnOffsetY + Phaser.Math.Between(-400,400)})
  }
  setTarget(){

  }
  damage(d){
    this.health -= d
    // console.log(this.health);
    if(this.health <= 0){
      // console.log("base is dead");
      this.scene.events.emit("base-destroy", this.team)
    }
  }
}
