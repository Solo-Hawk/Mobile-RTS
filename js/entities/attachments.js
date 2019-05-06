class Attachment extends Phaser.GameObjects.Sprite{
  constructor(host, texture, px, py){
    super(host.scene, host.position.x, host.position.y, texture)
    this.host = host
    this.scene = this.host.scene
    this.scene.add.existing(this)


    this.px = px || 0;
    this.py = py || 0;

    this.update()
    this.setDepth(100)
  }

  update(){
    var pos = this.host.getPosition()
    this.setPosition(
      pos.x +(this.px * Math.cos(this.host.rotation) - this.py * Math.sin(this.host.rotation)),
      pos.y +(this.px * Math.sin(this.host.rotation) + this.py * Math.cos(this.host.rotation))
    )

  }
}

class Gun extends Attachment{
  constructor(host, texture, x, y){
    super(host, texture, x, y)
    this.range = 4000;
    this.damage = 20;
    this.maxAmmo = 12;
    this.ammo = this.maxAmmo;
    this.firerate = 120 ;
    this.reloadTime = 1000
    this.loaded = true;
    this.reloading = false;
  }

  update(){
    this.checkFire()
    super.update()
    this.setRotation(this.host.rotation)
  }
  checkFire(){

    if(this.loaded && this.host.state == 1 && this.host.mode == Game.Utils.statics.commands.ATTACK){
      // console.log("Can Shoot");
      var line = this.host.getTarget().getPosition().subtract(this.host.getPosition())

      var shortestAngle = Phaser.Math.Angle.ShortestBetween(Phaser.Math.RadToDeg(this.host.rotation), Phaser.Math.RadToDeg(line.toAngle()))
      // console.log(line.length());
      // console.log(line.length() <= this.range);
      // console.log(Phaser.Math.RadToDeg(this.host.rotation));
      // console.log(Phaser.Math.RadToDeg(line.toAngle()));
      // console.log((this.host.rotation - 15) < shortestAngle &&  shortestAngle < (this.host.rotaiton + 15));
      // console.log(shortestAngle);
      if(
        line.length() <= this.range && -15 < shortestAngle && shortestAngle < 15){
        this.fire(this.host.getTarget())
      }
    }
  }

  fire(){
    if(this.loaded && this.host.state == 1){
      var target = this.host.getTarget()
      // console.log("fire");
      // console.log("Pew");
      this.graphics = this.host.scene.add.graphics({x:0, y:0})
      this.graphics.lineStyle(10, this.host.team == Game.Utils.statics.teams.PLAYER? 0x0000ff : 0xff0000, 1.0);
      this.graphics.beginPath();
      this.graphics.moveTo(this.x, this.y);
      var offX = Phaser.Math.Between(-target.width/2, target.width/2)
      var offY = Phaser.Math.Between(-target.height/2, target.height/2)
      var placeX = (offX * Math.cos(target.rotation) - offY * Math.sin(target.rotation))
      var placeY = (offX * Math.sin(target.rotation) + offY * Math.cos(target.rotation))
      this.graphics.lineTo(target.x + placeX, target.y + placeY);
      this.graphics.closePath();
      this.graphics.strokePath();
      target.damage(this.damage)
      this.ammo -= 1;
      this.scene.time.delayedCall(30,()=>{
        this.graphics.clear()
      },[],this)



      this.loaded = false
      if(this.ammo == 0){
        this.reload()
      }else{
        this.scene.time.delayedCall(this.firerate, ()=>{
          this.loaded = true
        },[],this)
      }
    }
  }
  reload(){
    this.reloading = true
    this.host.state = 2
    this.host.scene.time.delayedCall(this.reloadTime, ()=>{
      this.ammo = this.maxAmmo
      this.loaded = true
      this.reloading = false
    },[],this)

  }
}

class MissleLauncher extends Attachment{
  constructor(host, texture, x, y,firerate, maxAmmo, reloadTime,range, launchtime, lifetime, damage, missleScale){
    super(host, texture, x, y)
    this.range = range;
    this.damage = damage;
    this.maxAmmo = maxAmmo;
    this.ammo = this.maxAmmo;
    this.firerate = firerate ;
    this.reloadTime = reloadTime
    this.loaded = true;
    this.reloading = false;
    this.launchtime = launchtime
    this.lifetime = lifetime
    this.missleScale = missleScale
  }

  update(){
    this.checkFire()
    super.update()
    this.setRotation(this.host.rotation)
  }
  checkFire(){

    if(this.loaded){
      // console.log("Can Shoot");
      var line = this.host.getTarget().getPosition().subtract(this.host.getPosition())

      // console.log(line.length());
      // console.log(line.length() <= this.range);
      // console.log(Phaser.Math.RadToDeg(this.host.rotation));
      // console.log(Phaser.Math.RadToDeg(line.toAngle()));
      // console.log((this.host.rotation - 15) < shortestAngle &&  shortestAngle < (this.host.rotaiton + 15));
      // console.log(shortestAngle);
      if(
        line.length() <= this.range){
        this.fire(this.host.getTarget())
      }
    }
  }

  fire(target){
    // return
    if(this.loaded){
      this.launchMissle(target)
      this.ammo -= 1;



      this.loaded = false
      if(this.ammo == 0){
        this.reload()
      }else{
        this.scene.time.delayedCall(this.firerate, ()=>{
          this.loaded = true
        },[],this)
      }
    }
  }
  launchMissle(target){
    new Missle(this.host, this.x, this.y, "missle-red", target,this.damage,this.launchtime, this.lifetime, this.missleScale, this.rotation + Phaser.Math.DegToRad(Phaser.Math.Between(-160,-20)))
    new Missle(this.host, this.x, this.y, "missle-red", target,this.damage,this.launchtime, this.lifetime, this.missleScale, this.rotation + Phaser.Math.DegToRad(Phaser.Math.Between(20,160)))
  }
  reload(){
    this.reloading = true
    this.host.state = 2
    this.host.scene.time.delayedCall(this.reloadTime, ()=>{
      this.ammo = this.maxAmmo
      this.loaded = true
      this.reloading = false
    },[],this)

  }
}

class SmartMissleLauncher extends Attachment{
  constructor(host, texture, x, y,firerate, maxAmmo, reloadTime,range, launchtime, lifetime, damage, missleScale){
    super(host, texture, x, y)
    this.range = range;
    this.damage = damage;
    this.maxAmmo = maxAmmo;
    this.ammo = this.maxAmmo;
    this.firerate = firerate ;
    this.reloadTime = reloadTime
    this.loaded = true;
    this.reloading = false;
    this.launchtime = launchtime
    this.lifetime = lifetime
    this.missleScale = missleScale
  }

  update(){
    this.checkFire()
    super.update()
    this.setRotation(this.host.rotation)
  }
  checkFire(){

    if(this.loaded){
      // console.log("Can Shoot");
      var line = this.host.getTarget().getPosition().subtract(this.host.getPosition())

      // console.log(line.length());
      // console.log(line.length() <= this.range);
      // console.log(Phaser.Math.RadToDeg(this.host.rotation));
      // console.log(Phaser.Math.RadToDeg(line.toAngle()));
      // console.log((this.host.rotation - 15) < shortestAngle &&  shortestAngle < (this.host.rotaiton + 15));
      // console.log(shortestAngle);
      if(
        line.length() <= this.range){
        this.fire(this.host.getTarget())
      }
    }
  }

  fire(target){
    // return
    if(this.loaded){
      this.launchMissle(target)
      this.ammo -= 1;



      this.loaded = false
      if(this.ammo == 0){
        this.reload()
      }else{
        this.scene.time.delayedCall(this.firerate, ()=>{
          this.loaded = true
        },[],this)
      }
    }
  }
  launchMissle(target){
    target.formation.ships[Math.floor(Math.random()*(target.formation.ships.length-1))]
    new Missle(this.host, this.x, this.y, "missle-red", target.formation.ships[Math.floor(Math.random()*(target.formation.ships.length-1))],this.damage,this.launchtime, this.lifetime, this.missleScale, this.rotation + Phaser.Math.DegToRad(Phaser.Math.Between(-160,-20)))
    new Missle(this.host, this.x, this.y, "missle-red", target.formation.ships[Math.floor(Math.random()*(target.formation.ships.length-1))],this.damage,this.launchtime, this.lifetime, this.missleScale, this.rotation + Phaser.Math.DegToRad(Phaser.Math.Between(20,160)))
  }
  reload(){
    this.reloading = true
    this.host.scene.time.delayedCall(this.reloadTime, ()=>{
      this.ammo = this.maxAmmo
      this.loaded = true
      this.reloading = false
    },[],this)

  }
}

class SmartMissleLauncherV2 extends Attachment{
  constructor(host, texture, x, y,firerate, maxAmmo, reloadTime,range, launchtime, lifetime, damage, missleScale){
    super(host, texture, x, y)
    this.range = range;
    this.damage = damage;
    this.maxAmmo = maxAmmo;
    this.ammo = this.maxAmmo;
    this.firerate = firerate ;
    this.reloadTime = reloadTime
    this.loaded = true;
    this.reloading = false;
    this.launchtime = launchtime
    this.lifetime = lifetime
    this.missleScale = missleScale
  }

  update(){
    this.checkFire()
    super.update()
    this.setRotation(this.host.rotation)
  }
  checkFire(){

    if(this.loaded){
      // console.log("Can Shoot");
      var line = this.host.getTarget().getPosition().subtract(this.host.getPosition())

      // console.log(line.length());
      // console.log(line.length() <= this.range);
      // console.log(Phaser.Math.RadToDeg(this.host.rotation));
      // console.log(Phaser.Math.RadToDeg(line.toAngle()));
      // console.log((this.host.rotation - 15) < shortestAngle &&  shortestAngle < (this.host.rotaiton + 15));
      // console.log(shortestAngle);
      if(
        line.length() <= this.range){
        this.fire(this.host.getTarget())
      }
    }
  }

  fire(target){
    // return
    if(this.loaded){
      this.launchMissle(target)
      this.ammo -= 1;



      this.loaded = false
      if(this.ammo == 0){
        this.reload()
      }else{
        this.scene.time.delayedCall(this.firerate, ()=>{
          this.loaded = true
        },[],this)
      }
    }
  }
  launchMissle(target){
    new Missle(this.host, this.x, this.y, "missle-red", target.formation.ships[Math.floor(Math.random()*(target.formation.ships.length-1))],this.damage,this.launchtime, this.lifetime, this.missleScale, this.rotation + Phaser.Math.DegToRad(Phaser.Math.Between(-160,-20)))
    new Missle(this.host, this.x, this.y, "missle-red", target.formation.ships[Math.floor(Math.random()*(target.formation.ships.length-1))],this.damage,this.launchtime, this.lifetime, this.missleScale, this.rotation + Phaser.Math.DegToRad(Phaser.Math.Between(-160,-20)))
    new Missle(this.host, this.x, this.y, "missle-red", target.formation.ships[Math.floor(Math.random()*(target.formation.ships.length-1))],this.damage,this.launchtime, this.lifetime, this.missleScale, this.rotation + Phaser.Math.DegToRad(Phaser.Math.Between(-160,-20)))
    new Missle(this.host, this.x, this.y, "missle-red", target.formation.ships[Math.floor(Math.random()*(target.formation.ships.length-1))],this.damage,this.launchtime, this.lifetime, this.missleScale, this.rotation + Phaser.Math.DegToRad(Phaser.Math.Between(20,160)))
    new Missle(this.host, this.x, this.y, "missle-red", target.formation.ships[Math.floor(Math.random()*(target.formation.ships.length-1))],this.damage,this.launchtime, this.lifetime, this.missleScale, this.rotation + Phaser.Math.DegToRad(Phaser.Math.Between(20,160)))
    new Missle(this.host, this.x, this.y, "missle-red", target.formation.ships[Math.floor(Math.random()*(target.formation.ships.length-1))],this.damage,this.launchtime, this.lifetime, this.missleScale, this.rotation + Phaser.Math.DegToRad(Phaser.Math.Between(20,160)))
  }
  reload(){
    this.reloading = true
    this.host.scene.time.delayedCall(this.reloadTime, ()=>{
      this.ammo = this.maxAmmo
      this.loaded = true
      this.reloading = false
    },[],this)

  }
}

class Missle extends Steerable{
  constructor(host, x, y, texture, target, damage,launchtime, lifetime, scale, offset){
    super(host.scene, x, y, texture)
    this.host = host
    // console.log(offset);
    this.damage = damage
    this.launchline = Game.Utils.vector2d(host.x, host.y)
    this.launchline.add(Game.Utils.vector2d(20000,0).angleTo(offset))
    this.maxLinearSpeed = 8000
    this.maxLinearAcceleration = 1000
    this.target = target
    this.alive = true
    this.launch = true
    this.scene.time.delayedCall(launchtime, ()=>{
      this.launch = false
      this.maxLinearSpeed = 12000
      this.maxLinearAcceleration = 2400
    },[],this)

    this.scene.time.delayedCall(lifetime, ()=>{
      this.alive = false
    },[],this)

    super.update()

    this.scene.gameManager.projectiles.push(this)
    this.setScale(scale)
  }
  update(){
    if(!this.alive)return
    if(this.launch){
      // console.log("Launch");
      // console.log(this.launchline.x, this.launchline.y);
      this.seek(this.launchline.clone(), 0)
    }else{
      this.seek(this.target.getPosition(), 0)

    }
    if(this.distanceFrom(this.target) <= this.target.shortest*1.5){
      this.target.damage(this.damage)
      // console.log("Missle Hit");
      // console.log(this.scene.events.eventNames());
      var temp = this.scene.events.emit('missle-destroy',this.getPosition())
      this.alive = false
    }
    if(!this.target.alive){
      if(this.host.target.formation){
        this.target = this.host.target.formation.ships[Math.floor(Math.random()*(this.host.target.formation.ships.length-1))]
      }else{
        this.target = this.host.target
      }
      // this.alive = false
    }
    super.update()
  }
}

class Turret extends Attachment{
  constructor(host, texture, x, y){
    super(host, texture, x, y)
    this.range = 10000;
    this.damage = 40;
    this.maxAmmo = 100;
    this.ammo = this.maxAmmo;
    this.firerate = 20 ;
    this.reloadTime = 4000
    this.loaded = true;
    this.reloading = false;
    this.target = Game.Utils.statics.BLANK
  }


  update(){
    // console.log("update");
    this.checkFire()
    super.update()
    this.rotate()

  }
  checkFire(){
    this.target = this.target || this.host.getTarget()
    if(!this.target.alive)this.target = this.host.getTarget()
    // console.log("----");
    // console.log("1", this.loaded);
    // console.log("2", this.host.state == 1 || this.host.state == 3);
    // console.log("3", this.host.mode == Game.Utils.statics.commands.ATTACK);
    // console.log("4", this.loaded && (this.host.state == 1 || this.host.state == 3) && this.host.mode == Game.Utils.statics.commands.ATTACK);
    if(this.loaded){
      // console.log("Can Shoot");
      var line = this.target.getPosition().subtract(this.host.getPosition())

      var shortestAngle = Phaser.Math.Angle.ShortestBetween(Phaser.Math.RadToDeg(this.rotation), Phaser.Math.RadToDeg(line.toAngle()))
      // console.log(line.length());
      // console.log(line.length() <= this.range && -15 < shortestAngle && shortestAngle < 15);
      if(
        line.length() <= this.range && -15 < shortestAngle && shortestAngle < 15){
        this.fire(this.target)
      }else{
        this.target = this.host.target.formation.ships[Math.floor(Math.random()*(this.host.target.formation.ships.length-1))]
      }
    }
  }
  fire(){
    if(this.loaded){
      var target = this.host.getTarget()
      // console.log("fire");
      // console.log("Pew");
      this.graphics = this.host.scene.add.graphics({x:0, y:0})
      this.graphics.lineStyle(10, this.host.team == Game.Utils.statics.teams.PLAYER? 0x0000ff : 0xff0000, 1.0);
      this.graphics.beginPath();
      this.graphics.moveTo(this.x, this.y);
      var offX = Phaser.Math.Between(-target.width/2, target.width/2)
      var offY = Phaser.Math.Between(-target.height/2, target.height/2)
      var placeX = (offX * Math.cos(target.rotation) - offY * Math.sin(target.rotation))
      var placeY = (offX * Math.sin(target.rotation) + offY * Math.cos(target.rotation))
      this.graphics.lineTo(target.x + placeX, target.y + placeY);
      this.graphics.closePath();
      this.graphics.strokePath();
      target.damage(this.damage)
      this.ammo -= 1;
      this.scene.time.delayedCall(15,()=>{
        this.graphics.clear()
      },[],this)



      this.loaded = false
      if(this.ammo == 0){
        this.reload()
      }else{
        this.scene.time.delayedCall(this.firerate, ()=>{
          this.loaded = true
        },[],this)
      }
    }
  }
  reload(){
    this.reloading = true
    this.host.state = 2
    this.host.scene.time.delayedCall(this.reloadTime, ()=>{
      this.ammo = this.maxAmmo
      this.loaded = true
      this.reloading = false
    },[],this)

  }

  rotate(){
    if(this.host.getTarget()==Game.Utils.statics.BLANK){
      this.setRotation(Phaser.Math.Angle.RotateTo(
        this.rotation,
        this.host.rotation,
        0.2
      ))
      }else{
        if(this.host.getPosition().subtract(this.host.getTarget().getPosition()).length() > 100){

          this.setRotation(Phaser.Math.Angle.RotateTo(
            this.rotation,
            this.host.getTarget().getPosition().subtract(this.host.getPosition()).toAngle(),
            0.2
          ))

      }else{

        this.setRotation(Phaser.Math.Angle.RotateTo(
          this.rotation,
          this.host.rotation,
          0.2
        ))


      }
    }
  }
}

class HeavyTurret extends Attachment{
  constructor(host, texture, x, y){
    super(host, texture, x, y)
    this.range = 16000;
    this.damage = 100;
    this.maxAmmo = 3;
    this.ammo = this.maxAmmo;
    this.firerate = 400 ;
    this.reloadTime = 4000
    this.loaded = true;
    this.reloading = false;
  }


  update(){

    this.checkFire()
    super.update()
    this.rotate()

  }
  checkFire(){
    if(this.loaded){
      // console.log("Can Shoot");
      var line = this.host.getTarget().getPosition().subtract(this.host.getPosition())

      var shortestAngle = Phaser.Math.Angle.ShortestBetween(Phaser.Math.RadToDeg(this.rotation), Phaser.Math.RadToDeg(line.toAngle()))
      if(
        line.length() <= this.range && -15 < shortestAngle && shortestAngle < 15){
        this.fire(this.host.getTarget())
      }
    }
  }
  fire(){
    if(this.loaded){
      var target = this.host.getTarget()
      // console.log("fire");
      // console.log("Pew");
      this.graphics = this.host.scene.add.graphics({x:0, y:0})
      this.graphics.lineStyle(30, this.host.team == Game.Utils.statics.teams.PLAYER? 0x0000ff : 0xff0000, 1.0);
      this.graphics.beginPath();
      this.graphics.moveTo(this.x, this.y);
      var offX = Phaser.Math.Between(-target.width/2, target.width/2)
      var offY = Phaser.Math.Between(-target.height/2, target.height/2)
      var placeX = (offX * Math.cos(target.rotation) - offY * Math.sin(target.rotation))
      var placeY = (offX * Math.sin(target.rotation) + offY * Math.cos(target.rotation))
      this.graphics.lineTo(target.x + placeX, target.y + placeY);
      this.graphics.closePath();
      this.graphics.strokePath();
      target.damage(this.damage)
      this.ammo -= 1;
      this.scene.time.delayedCall(45,()=>{
        this.graphics.clear()
      },[],this)



      this.loaded = false
      if(this.ammo == 0){
        this.reload()
      }else{
        this.scene.time.delayedCall(this.firerate, ()=>{
          this.loaded = true
        },[],this)
      }
    }
  }
  reload(){
    this.reloading = true
    this.host.state = 2
    this.host.scene.time.delayedCall(this.reloadTime, ()=>{
      this.ammo = this.maxAmmo
      this.loaded = true
      this.reloading = false
    },[],this)

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

class SuperTurret extends Attachment{
  constructor(host, texture, x, y){
    super(host, texture, x, y)
    this.range = 22000;
    this.damage = 1000;
    this.maxAmmo = 4;
    this.ammo = this.maxAmmo;
    this.firerate = 1000 ;
    this.reloadTime = 8000
    this.loaded = true;
    this.reloading = false;
  }


  update(){

    this.checkFire()
    super.update()
    this.rotate()

  }
  checkFire(){
    if(this.loaded){
      // console.log("Can Shoot");
      var line = this.host.getTarget().getPosition().subtract(this.host.getPosition())

      var shortestAngle = Phaser.Math.Angle.ShortestBetween(Phaser.Math.RadToDeg(this.rotation), Phaser.Math.RadToDeg(line.toAngle()))
      if(
        line.length() <= this.range && -15 < shortestAngle && shortestAngle < 15){
        this.fire(this.host.getTarget())
      }
    }
  }
  fire(){
    if(this.loaded && this.host.state == 1){
      var target = this.host.getTarget()
      // console.log("fire");
      // console.log("Pew");
      this.graphics = this.host.scene.add.graphics({x:0, y:0})
      this.graphics.lineStyle(70, this.host.team == Game.Utils.statics.teams.PLAYER? 0x0000ff : 0xff0000, 1.0);
      this.graphics.beginPath();
      this.graphics.moveTo(this.x, this.y);
      var offX = Phaser.Math.Between(-target.width/2, target.width/2)
      var offY = Phaser.Math.Between(-target.height/2, target.height/2)
      var placeX = (offX * Math.cos(target.rotation) - offY * Math.sin(target.rotation))
      var placeY = (offX * Math.sin(target.rotation) + offY * Math.cos(target.rotation))
      this.graphics.lineTo(target.x + placeX, target.y + placeY);
      this.graphics.closePath();
      this.graphics.strokePath();
      target.damage(this.damage)
      this.ammo -= 1;
      this.scene.time.delayedCall(45,()=>{
        this.graphics.clear()
      },[],this)



      this.loaded = false
      if(this.ammo == 0){
        this.reload()
      }else{
        this.scene.time.delayedCall(this.firerate, ()=>{
          this.loaded = true
        },[],this)
      }
    }
  }
  reload(){
    this.reloading = true
    this.host.state = 2
    this.host.scene.time.delayedCall(this.reloadTime, ()=>{
      this.ammo = this.maxAmmo
      this.loaded = true
      this.reloading = false
    },[],this)

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

class MegaGun extends Attachment{
  constructor(host, texture, x, y){
    super(host, texture, x, y)
    this.range = 40000;
    this.damage = 5000;
    this.maxAmmo = 1;
    this.ammo = this.maxAmmo;
    this.firerate = 150 ;
    this.reloadTime = 12000
    this.loaded = true;
    this.reloading = false;
    this.setDepth(0)
  }

  update(){
    this.checkFire()
    super.update()
    this.setRotation(this.host.rotation)
  }
  checkFire(){

    if(this.loaded){
      // console.log("Can Shoot");
      var line = this.host.getTarget().getPosition().subtract(this.host.getPosition())

      var shortestAngle = Phaser.Math.Angle.ShortestBetween(Phaser.Math.RadToDeg(this.host.rotation), Phaser.Math.RadToDeg(line.toAngle()))
      // console.log(line.length());
      // console.log(line.length() <= this.range);
      // console.log(Phaser.Math.RadToDeg(this.host.rotation));
      // console.log(Phaser.Math.RadToDeg(line.toAngle()));
      // console.log((this.host.rotation - 15) < shortestAngle &&  shortestAngle < (this.host.rotaiton + 15));
      // console.log(shortestAngle);
      if(
        line.length() <= this.range && -30 < shortestAngle && shortestAngle < 30){
        this.fire(this.host.getTarget())
      }
    }
  }

  fire(){
    if(this.loaded){
      var target = this.host.getTarget()
      // console.log("fire");
      // console.log("Pew");
      this.graphics = this.host.scene.add.graphics({x:0, y:0})
      this.graphics.lineStyle(200, this.host.team == Game.Utils.statics.teams.PLAYER? 0x0000ff : 0xff0000, 1.0);
      this.graphics.setDepth(0)
      this.graphics.beginPath();
      this.graphics.moveTo(this.x, this.y);
      var offX = Phaser.Math.Between(-target.width/2, target.width/2)
      var offY = Phaser.Math.Between(-target.height/2, target.height/2)
      var placeX = (offX * Math.cos(target.rotation) - offY * Math.sin(target.rotation))
      var placeY = (offX * Math.sin(target.rotation) + offY * Math.cos(target.rotation))
      this.graphics.lineTo(target.x + placeX, target.y + placeY);
      this.graphics.closePath();
      this.graphics.strokePath();
      target.damage(this.damage)
      this.ammo -= 1;
      this.scene.time.delayedCall(120,()=>{
        this.graphics.clear()
      },[],this)



      this.loaded = false
      if(this.ammo == 0){
        this.reload()
      }else{
        this.scene.time.delayedCall(this.firerate, ()=>{
          this.loaded = true
        },[],this)
      }
    }
  }
  reload(){
    this.reloading = true
    this.host.state = 2
    this.host.scene.time.delayedCall(this.reloadTime, ()=>{
      this.ammo = this.maxAmmo
      this.loaded = true
      this.reloading = false
    },[],this)

  }
}
