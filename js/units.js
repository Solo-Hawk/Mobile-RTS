console.log("Steerable Class - Loaded");



class Steerable extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame, options){
    super(scene, x, y, texture, frame, options)
    this.debug = {}
    this.debug.velocity = this.scene.add.line(x, y, 0,0,0,0, 0x00FF00)
    this.debug.desiredVelocity = this.scene.add.line(x, y, 0,0,0,0, 0x0000FF)
    this.debug.steering = this.scene.add.line(x, y, 0,0,0,0, 0xFF0000)

    this.scene = scene;

    scene.matter.add.gameObject(this);
    scene.add.existing(this);
    this.body.parent = this;

    console.log(this.body);

    this.linearVelocity = 0;
    this.maxLinearVelocity = 4;

    this.linearAcceleration = 0;
    this.maxLinearAcceleration = 1;

    this.angularRotation = 3;
    this.maxAngularRotation = 0.6; // In Degress

    // setInterval(() => {console.clear()},3000)
    Phaser.Physics.Matter.Matter.Body.setVelocity(this.body, {x:60, y:60})

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

  update(){
    this.seek()


    // console.log("rot", this.getRotation());
  }

  seek(){
    var matterVector = Phaser.Physics.Matter.Matter.Vector
    var matterBody   = Phaser.Physics.Matter.Matter.Body

    var position = this.getPosition()

    var target = matterVector.create(412 +(2 - Math.random()*4), 206 +(2 - Math.random()*4))

    var velocity = matterVector.clone(this.body.velocity)


    var desiredVelocity = matterVector.sub(target, position)

    // console.log(velocity, desiredVelocity);

    desiredVelocity = matterVector.normalise(desiredVelocity)
    desiredVelocity = matterVector.mult(desiredVelocity, this.maxLinearVelocity)

    var steering = matterVector.sub(desiredVelocity, velocity)
    // console.log(matterVector.magnitude(steering));
    if (matterVector.magnitude(steering) > 0.1){
      // console.log("flag 1");
      steering = matterVector.normalise(steering)
      steering = matterVector.mult(steering, 0.1)
    }

    steering = matterVector.div(steering, 1)
    velocity = matterVector.add(velocity, steering)
    // console.log(matterVector.magnitude(velocity));
    if (matterVector.magnitude(velocity) > this.maxLinearVelocity){
      // console.log("flag 2");
      velocity = matterVector.normalise(velocity)
      velocity = matterVector.mult(velocity, this.maxLinearVelocity)
    }


    var debug = this.scene.debugLayer

    debug.clear();
    // console.log(debug);
    debug.lineStyle(2, 0x00FF00, 1.0);
    debug.beginPath();
    debug.moveTo(position.x, position.y)
    debug.lineTo(position.x + (velocity.x * 10), position.y + (velocity.y* 10))
    debug.closePath();
    debug.strokePath();
    debug.lineStyle(2, 0xFF0000, 1.0);
    debug.beginPath();
    debug.moveTo(position.x, position.y)
    debug.lineTo(position.x + (desiredVelocity.x * 10), position.y + (desiredVelocity.y* 10))
    debug.closePath();
    debug.strokePath();
    debug.lineStyle(2, 0x0000FF, 1.0);
    debug.beginPath();
    debug.moveTo(position.x + (velocity.x * 10), position.y + (velocity.y* 10))
    debug.lineTo(position.x + (velocity.x * 10) + (steering.x * 10), position.y + (velocity.y* 10) + (steering.y * 10))
    debug.closePath();
    debug.strokePath();
    // console.log(velocity, steering);
    matterBody.setVelocity(this.body, velocity)


    // var vectorMatter = Phaser.Physics.Matter.Matter.Vector
    // var pos = this.getPosition();
    // var vel = vectorMatter.normalise(this.body.velocity);
    //
    // var desVel = vectorMatter.create(412,206)
    // desVel = vectorMatter.sub(desVel, pos)
    // desVel = vectorMatter.normalise(desVel)
    //   /*
    //     this.target.clone()
    //       .add(util.vector2d(
    //           steeringAI.speeds.seek.offset - Math.random() * (steeringAI.speeds.seek.offset * 2),
    //           steeringAI.speeds.seek.offset - Math.random() * (steeringAI.speeds.seek.offset * 2)
    //       ))
    //       .subtract(pos)
    //       .normalise(); // normalise
    //   */
    //
    //          // normalise
    // var steering = vectorMatter.sub(
    //                 vectorMatter.clone(desVel),vel)
    // steering = vectorMatter.normalise(steering)
    // steering = vectorMatter.mult(steering, this.angularRotation)
    // //steering.scale(game.delta)
    // vel = vectorMatter.normalise(vectorMatter.add(vel,steering))
    // vel = vectorMatter.mult(vel, this.maxLinearVelocity)
    // //vel.scale(game.delta)
    // Phaser.Physics.Matter.Matter.Body.setVelocity(this.body, vel)
    // console.log(steering);
  }


}

class BaseUnit extends Steerable{

}
