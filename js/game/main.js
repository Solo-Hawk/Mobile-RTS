
var config = {
  type: Phaser.AUTO,
  width: 824,
  height: 412,
  pixelArt: false,
  physics: {
    default: 'impact',
    impact:{
      debug: true,
      gravity: 0,
      timeScale: 1,
      setBounds: false
    }
  },
  scene: [SceneLoader, SceneMenu, SceneLevelDevelopment],
  plugins: {
    scene: [
      { key: "NavMeshPlugin", plugin: PhaserNavMeshPlugin, mapping: "navMeshPlugin", start: true }
    ]
  }

}

var game = new Phaser.Game(config)
