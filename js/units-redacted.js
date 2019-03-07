console.log("Steerable Class - Loaded");

var util = {
    vector2d: function (x, y) {
        var v = {
            x: x || 0,
            y: y || 0,
            add: function (v) {
                this.x += v.x;
                this.y += v.y;
                return this;
            },
            subtract: function (v) {
                this.x -= v.x;
                this.y -= v.y;
                return this;
            },
            normalise: function () {
                var len = this.length();
                this.x /= len;
                this.y /= len;
                return this;
            },
            scale: function (s) {
                this.x *= s;
                this.y *= s;
                return this;
            },
            truncate: function(max) {
              var i = max / this.length()
              i = i < 1.0 ? i : 1.0
              this.scale(i)
            },
            length: function () {
                return Math.sqrt((this.x * this.x) + (this.y * this.y));
            },
            rotate: function (a) {
                var angle = (this.toAngle() * 180 / Math.PI) + a
                this.angleTo(angle);
                return this;
            },
            toAngle: function () {return -Math.atan2(-this.y, this.x) },
            angleTo: function (rad) {
                var len = this.length();
                this.x = len * Math.cos(rad);
                this.y = len * Math.sin(rad);
                return this;

            },
            set: function (x, y) {
                this.x = x;
                this.y = y;
                return this;
            },
            clone: function () {
                return util.vector2d(this.x, this.y)
            }

        }
        return v
    }

}
var config = {
  movement: function (){
    var m = {

      radius: 80
    }
  }
}

class Steerable extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame, options){
    super(scene, x, y, texture, frame, options)
    this.debug = {}
    this.debug.velocity = this.scene.add.line(x, y, 0,0,0,0, 0x00FF00)
    this.debug.desiredVelocity = this.scene.add.line(x, y, 0,0,0,0, 0x0000FF)
    this.debug.steering = this.scene.add.line(x, y, 0,0,0,0, 0xFF0000)

    this.scene = scene;
    this.setScale(0.4)

    scene.matter.add.gameObject(this);
    scene.add.existing(this);
    this.body.parent = this;

    console.log(this.body);

    this.linearVelocity = 0;
    this.maxLinearVelocity = 10;

    this.linearAcceleration = 0;
    this.maxLinearAcceleration = 2;

    this.angularRotation = 1;
    this.maxAngularRotation = 0.2; // In Degress

    // setInterval(() => {console.clear()},3000)
    // Phaser.Physics.Matter.Matter.Body.setVelocity(this.body, {x:-100, y:-100})

  }

  setMaxLinearVelocity(maxLinearVelocity){
    this.maxLinearVelocity = maxLinearVelocity
  }
  setLinearAcceleration(linearAcceleration){
    this.linearAcceleration = linearAcceleration
  }
  setMaxLinearAcceleration(maxLinearAcceleration){
    this.maxLinearAcceleration = maxLinearAcceleration
  }
  setMaxAngularRotation(maxAngularRotation){
    this.maxAngularRotation = maxAngularRotation
  }

  getRotation(){
    return -Math.atan2(-this.body.velocity.y, this.body.velocity.x)
  }

  getPosition(){
    return {x:this.x, y:this.y}
  }

  getVelocity(){// if the velocity is 0,0 the steering will have issues processing any movement. The velocity is given a normalised vector in the direction of the ship
    var vel = util.vector2d(this.body.velocity.x, this.body.velocity.y)
    if(vel.x == 0 && vel.y == 0){
      vel.x = 1;
      vel.y = 1;
      vel.normalise().angleTo(this.rotation)
    }
    return vel
  }

  setTarget(target){
      this.target = target //Providing a object will make the target always trace the object as it updates
  }

  getTarget(){
    return this.target
  }

  setBodyVelocity(v){
    Phaser.Physics.Matter.Matter.Body.setVelocity(this.body, v)
  }

  update(){
    this.arrival();


    // console.log("rot", this.getRotation());
  }

  seek(target){
    if (typeof target.x !== "number" || typeof target.y !== "number"){
      target = util.vector2d(412, 206)
    }else{
      target = util.vector2d(target.x, target.y)
    }

    var pos = this.getPosition();
    var vel = this.getVelocity().normalise();
    var desVel =
        util.vector2d(412, 206)
            .subtract(pos)
            .normalise(); // normalise
    var steering = desVel.clone().subtract(vel)
    steering.scale(this.maxAngularRotation)
    //steering.scale(game.delta)
    vel.add(steering).normalise()
    vel.scale(this.maxLinearVelocity)

    this.setRotation(vel.toAngle())
    this.setBodyVelocity(vel)

    {var debug = this.scene.debugLayer
    debug.clear()
    debug.lineStyle(2, 0xFF0000, 1.0);
    debug.beginPath();
    debug.moveTo(pos.x, pos.y);
    debug.lineTo(pos.x + (vel.x * 10), pos.y + (vel.y * 10))
    debug.strokePath();
    debug.closePath();
    debug.lineStyle(2, 0x00FF00, 1.0);
    debug.beginPath();
    debug.moveTo(pos.x, pos.y);
    debug.lineTo(pos.x + (desVel.x * 15), pos.y + (desVel.y * 15))
    debug.strokePath();
    debug.closePath();
    debug.lineStyle(2, 0x0000FF, 1.0);
    debug.beginPath();
    debug.moveTo(pos.x + (vel.x * 10), pos.y + (vel.y * 10));
    debug.lineTo(pos.x + (vel.x * 10) + (steering.x * 100), pos.y + (vel.y * 10) + (steering.y * 100 ))
    debug.strokePath();
    debug.closePath();}

    {// var matterVector = Phaser.Physics.Matter.Matter.Vector
    // var matterBody   = Phaser.Physics.Matter.Matter.Body
    //
    // var position = this.getPosition()
    //
    // // var target = matterVector.create(412 +(5 - Math.random()*10), 206 +(5 - Math.random()*10))
    // var target = matterVector.create(412 , 206 )
    //
    // var velocity = matterVector.clone(this.body.velocity)
    //
    //
    // var desiredVelocity = matterVector.sub(target, position)
    //
    // // console.log(velocity, desiredVelocity);
    //
    // desiredVelocity = matterVector.normalise(desiredVelocity)
    // desiredVelocity = matterVector.mult(desiredVelocity, this.maxLinearVelocity)
    // // console.log(Phaser.Math.Angle.Between(velocity.x, velocity.y, desiredVelocity.x, desiredVelocity.y));
    // // console.log(Math.abs(matterVector.angle(velocity, desiredVelocity)) + Math.abs(matterVector.angle(desiredVelocity, velocity)));
    // // if (Phaser.Math.DegToRad(180) == Math.abs(matterVector.angle(velocity, desiredVelocity)) + Math.abs(matterVector.angle(desiredVelocity, velocity))){
    // //   console.log("ITS A DIRECT ROT");
    // //   velocity = matterVector.add(velocity, matterVector.create(3 - (Math.random() * 6), 3 - (Math.random() * 6)))
    // // }
    //
    // // var steering = matterVector.sub(desiredVelocity, velocity)
    // // // console.log(matterVector.magnitude(steering));
    // // if (matterVector.magnitude(steering) > 0.1){
    // //   // console.log("flag 1");
    // //   steering = matterVector.normalise(steering)
    // //   steering = matterVector.mult(steering, 0.1)
    // // }
    // //
    // // steering = matterVector.div(steering, 3)
    // // velocity = matterVector.add(velocity, steering)
    //
    // // matterVector.rotateAbout(velocity, Phaser.Math.DegToRad(9 * (matterVector.magnitude(velocity) / this.maxLinearVelocity)), desiredVelocity, velocity)
    //
    // // console.log(matterVector.magnitude(velocity));
    // if (matterVector.magnitude(velocity) > this.maxLinearVelocity){
    //   // console.log("flag 2");
    //   velocity = matterVector.normalise(velocity)
    //   velocity = matterVector.mult(velocity, this.maxLinearVelocity)
    // }
    //
    //
    //
    // var debug = this.scene.debugLayer
    //
    // debug.clear();
    // // console.log(debug);
    // debug.lineStyle(2, 0xFF0000, 1.0);
    // debug.beginPath();
    // debug.moveTo(position.x, position.y)
    // debug.lineTo(position.x + (desiredVelocity.x * 60), position.y + (desiredVelocity.y* 60))
    // debug.closePath();
    // debug.strokePath();
    // debug.lineStyle(2, 0x00FF00, 1.0);
    // debug.beginPath();
    // debug.moveTo(position.x, position.y)
    // debug.lineTo(position.x + (velocity.x * 40), position.y + (velocity.y* 40))
    // debug.closePath();
    // debug.strokePath();
    // // debug.lineStyle(2, 0x0000FF, 1.0);
    // // debug.beginPath();
    // // debug.moveTo(position.x + (velocity.x * 40), position.y + (velocity.y* 40))
    // // debug.lineTo(position.x + (velocity.x * 40) + (steering.x * 100), position.y + (velocity.y* 40) + (steering.y * 100))
    // // debug.closePath();
    // // debug.strokePath();
    // // console.log(velocity, steering);
    //
    // matterBody.setVelocity(this.body, velocity)
    //
    //
    // // var vectorMatter = Phaser.Physics.Matter.Matter.Vector
    // // var pos = this.getPosition();
    // // var vel = vectorMatter.normalise(this.body.velocity);
    // //
    // // var desVel = vectorMatter.create(412,206)
    // // desVel = vectorMatter.sub(desVel, pos)
    // // desVel = vectorMatter.normalise(desVel)
    // //   /*
    // //     this.target.clone()
    // //       .add(util.vector2d(
    // //           steeringAI.speeds.seek.offset - Math.random() * (steeringAI.speeds.seek.offset * 2),
    // //           steeringAI.speeds.seek.offset - Math.random() * (steeringAI.speeds.seek.offset * 2)
    // //       ))
    // //       .subtract(pos)
    // //       .normalise(); // normalise
    // //   */
    // //
    // //          // normalise
    // // var steering = vectorMatter.sub(
    // //                 vectorMatter.clone(desVel),vel)
    // // steering = vectorMatter.normalise(steering)
    // // steering = vectorMatter.mult(steering, this.angularRotation)
    // // //steering.scale(game.delta)
    // // vel = vectorMatter.normalise(vectorMatter.add(vel,steering))
    // // vel = vectorMatter.mult(vel, this.maxLinearVelocity)
    // // //vel.scale(game.delta)
    // // Phaser.Physics.Matter.Matter.Body.setVelocity(this.body, vel)
    // // console.log(steering);
    }
  }

  flee(target){ // Target need to be a util vector2d object (matter vector will throw errors)
    if (typeof target.position.x !== "number" || typeof target.position.y !== "number"){
      target = util.vector2d(412, 206)
    }else{
      target = util.vector2d(target.x, target.y)
    }

    var pos = this.getPosition();
    var vel = this.getVelocity().normalise();
    var desVel =
        target.clone()
              .subtract(pos)
              .normalise()
              .scale(-1); // normalise
    var steering = desVel.clone().subtract(vel)
    steering.scale(this.maxAngularRotation)
    //steering.scale(game.delta)
    vel.add(steering).normalise()
    vel.scale(this.maxLinearVelocity)

    this.setRotation(vel.toAngle())
    this.setBodyVelocity(vel)

    {var debug = this.scene.debugLayer
    debug.clear()
    debug.lineStyle(2, 0xFF0000, 1.0);
    debug.beginPath();
    debug.moveTo(pos.x, pos.y);
    debug.lineTo(pos.x + (vel.x * 10), pos.y + (vel.y * 10))
    debug.strokePath();
    debug.closePath();
    debug.lineStyle(2, 0x00FF00, 1.0);
    debug.beginPath();
    debug.moveTo(pos.x, pos.y);
    debug.lineTo(pos.x + (desVel.x * 15), pos.y + (desVel.y * 15))
    debug.strokePath();
    debug.closePath();
    debug.lineStyle(2, 0x0000FF, 1.0);
    debug.beginPath();
    debug.moveTo(pos.x + (vel.x * 10), pos.y + (vel.y * 10));
    debug.lineTo(pos.x + (vel.x * 10) + (steering.x * 100), pos.y + (vel.y * 10) + (steering.y * 100 ))
    debug.strokePath();
    debug.closePath();}
  }

  arrival(target){
    var radius = 80;
    if (typeof target === "undefined" || typeof target.x !== "number" || typeof target.y !== "number"){
      target = util.vector2d(412, 206)
    }else{
      target = util.vector2d(target.x, target.y)
    }

    var pos = this.getPosition();
    var vel = this.getVelocity().normalise();
    var desVel = target.clone()
                       .subtract(pos); // normalise
    var distance = desVel.length();
    if (distance < radius){
      desVel.normalise().scale(this.maxLinearAcceleration).scale(distance / radius)
    }else{
      desVel.normalise().scale(this.maxLinearAcceleration)
    }

    var steering = desVel.clone()
                         .subtract(vel)
    steering.scale(this.maxAngularRotation)
    //steering.scale(game.delta)
    vel.add(steering).truncate(desVel.length())



    this.setRotation(vel.toAngle())
    this.setBodyVelocity(vel)

    {var debug = this.scene.debugLayer
    debug.clear()
    debug.lineStyle(2, 0xFF0000, 1.0);
    debug.beginPath();
    debug.moveTo(pos.x, pos.y);
    debug.lineTo(pos.x + (vel.x * 10), pos.y + (vel.y * 10))
    debug.strokePath();
    debug.closePath();
    debug.lineStyle(2, 0x00FF00, 1.0);
    debug.beginPath();
    debug.moveTo(pos.x, pos.y);
    debug.lineTo(pos.x + (desVel.x * 15), pos.y + (desVel.y * 15))
    debug.strokePath();
    debug.closePath();
    debug.lineStyle(2, 0x0000FF, 1.0);
    debug.beginPath();
    debug.moveTo(pos.x + (vel.x * 10), pos.y + (vel.y * 10));
    debug.lineTo(pos.x + (vel.x * 10) + (steering.x * 100), pos.y + (vel.y * 10) + (steering.y * 100 ))
    debug.strokePath();
    debug.closePath();}
  }

  pursuit(){

  }

  evade(){

  }


}

class BaseUnit extends Steerable{

}