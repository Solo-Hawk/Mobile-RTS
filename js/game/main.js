var config = {
  type: Phaser.AUTO,
  width: 2280, //824
  height: 1080, //412
  pixelArt: false,
  physics: {
    default: 'impact',
    impact:{
      debug: false,
      gravity: 0,
      timeScale: 1,
      setBounds: false
    }
  },
  fps: {
    min: 15,
    target: 30,
  },
  scene: [SceneLoader, SceneMenu, SceneLevelDevelopment],
  scale:{
    mode:Phaser.Scale.FIT
  }

}

var game = new Phaser.Game(config)
