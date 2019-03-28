console.log("Unit Class Loaded");

class Interactable extends Phaser.GameObjects.Sprite{


  constructor(gameManager, scene, x, y, texture, type){
    super(scene, x, y, texture)
    this.type = type || "interactable"
    this.scene = scene
    this.gameManager = gameManager

    this.scene.add.existing(this)
    this.setOrigin(0.5, 0.5)

    this.scene.impact.add.existing(this)
    this.body.collides = Phaser.Physics.Impact.COLLIDES.NEVER

    this.setInteractive().on("pointerdown", ()=>{
      console.log(this);
      this.gameManager.userInterface.events.emit("set-focus",this);}, this.gameManager.userInterface)
  }


}

class Steerable extends Interactable{
  constructor(gameManager, scene, x, y, texture, type){
    super(gameManager, scene, x, y, texture, type)

    this.rotationLock = true;

    this.body.pos = gametools.utils.vector.vector2d(this.body.pos.x, this.body.pos.y)
    this.position               = this.body.pos
    this.body.vel = gametools.utils.vector.vector2d(0,0)
    this.linearVelocity         = this.body.vel
    this.desiredVelocity        = gametools.utils.vector.vector2d(0,0)
    this.steering               = gametools.utils.vector.vector2d(0,0)

    this.orientation            = this.body.angle // In Radians
    this.maxLinearSpeed         = 100;
    this.maxLinearAcceleration  = 50;
    this.maxAngularSpeed        = 4;
    this.maxAngularAcceleration = 3;

    this.proximityRange = 100;
    this.fleeDistance   = 50;
    this.maxDistance    = 0;

    this.displacement = 0;
    this.wanderPos    = gametools.utils.vector.vector2d(0,0);
    this.wanderForce  = gametools.utils.vector.vector2d(0,0);
  }

  getPosition(){
    return this.position.clone()
  }

  getLinearVelocity(){
    return this.linearVelocity.clone()
  }

  setLinearVelocity(velocity){
    this.linearVelocity.x = velocity.x
    this.linearVelocity.y = velocity.y
  }
  addLinearVelocity(velocity){
    this.linearVelocity.x += velocity.x
    this.linearVelocity.y += velocity.y
  }
    
  idle(){
    this.desiredVelocity = this.linearVelocity.clone().scale(0.9)
    this.setLinearVelocity(this.desiredVelocity)
  }
  seek(target, radius, brace){
    brace = brace || 0

    this.rotationLock = true
    var force = gametools.utils.vector.vector2d(0,0)
    var distance;

    this.desiredVelocity = target.clone().subtract(this.position)
    distance = this.desiredVelocity.length()
    this.desiredVelocity.normalise()

    if (distance <= radius){
      this.desiredVelocity.scale(this.maxLinearSpeed * (distance / radius))
    }else{
      this.desiredVelocity.scale(this.maxLinearSpeed)
    }

    if(distance <= radius / 2) this.rotationLock = false
    this.force = this.desiredVelocity.subtract(this.linearVelocity)

    this.addLinearVelocity(this.force)
  }
  flee(){
    this.rotationLock = true
    var force = gametools.utils.vector.vector2d(0,0)
    var distance;
    this.desiredVelocity = target.clone().subtract(this.getPosition())
    distance = this.desiredVelocity.length()
    this.desiredVelocity.normalise();
    this.desiredVelocity.scale(this.maxLinearSpeed).scale(-1)
    this.steering = this.desiredVelocity.clone().subtract(this.linearVelocity)
    this.steering.truncate(this.maxAngularSpeed)
    this.steering.add(this.linearVelocity)
    this.steering.truncate(this.maxLinearSpeed)

    this.setLinearVelocity(this.steering)
  }

}
