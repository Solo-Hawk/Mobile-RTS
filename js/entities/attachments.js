class Attachment extends Phaser.GameObjects.Sprite{
  constructor(host, texture, px, py){
    super(host.scene, host.position.x, host.position.y, texture)
    this.host = host
    this.scene = this.host.scene
    this.scene.add.existing(this)


    this.px = px || 0;
    this.py = py || 0;

    this.update()
  }

  update(){
    var pos = this.host.getPosition()
    this.setPosition(
      pos.x + this.host.displayOriginX + (this.px * Math.cos(this.host.rotation) - this.py * Math.sin(this.host.rotation)),
      pos.y + this.host.displayOriginY + (this.px * Math.sin(this.host.rotation) + this.py * Math.cos(this.host.rotation))
    )

  }
}

class Gun extends Attachment{
  constructor(host, texture, x, y){
    super(host, texture, x, y)
    this.range = 500;
    this.damage = 10;
    this.maxAmmo = 3;
    this.ammo = this.maxAmmo;
    this.firerate = 80 ;
    this.reloadTime = 3000
    this.loaded = true;
  }


  update(){
    this.checkFire()
    super.update()
    this.setRotation(this.host.rotation)
  }
  checkFire(){
    if(this.loaded && this.host.state == 1 && this.host.mode = Game.Utils.statics.commands.ATTACK){
      // console.log("Can Shoot");
      var line = this.host.getPosition().subtract(this.host.getTarget().getPosition())
      if(
        line.length() <= this.range && line.toAngle() == this.host.rotation){
        this.shoot(this.host.getTarget())
      }
    }
  }

  fire(){

  }
}
class Turret extends Attachment{
  constructor(host, texture, x, y){
    super(host, texture, x, y)
  }


  update(){
    super.update()
    this.rotate()

  }

  rotate(){
    if(this.host.getTarget()==Game.Utils.statics.BLANK){
      this.setRotation(Phaser.Math.Angle.RotateTo(
        this.rotation,
        this.host.rotation,
        0.1
      ))
      }else{
        if(this.host.getPosition().subtract(this.host.getTarget().getPosition()).length() > 100){

          this.setRotation(Phaser.Math.Angle.RotateTo(
            this.rotation,
            this.host.getTarget().getPosition().subtract(this.host.getPosition()).toAngle(),
            0.1
          ))

      }else{

        this.setRotation(Phaser.Math.Angle.RotateTo(
          this.rotation,
          this.host.rotation,
          0.1
        ))


      }
    }
  }
}
