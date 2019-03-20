
var config = {
  type: Phaser.AUTO,
  width: 1400, //824
  height: 564, //412
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
  plugins: {
    scene: [
      { key: "NavMeshPlugin", plugin: PhaserNavMeshPlugin, mapping: "navMeshPlugin", start: true }
    ]
  }

}

var game = new Phaser.Game(config)
