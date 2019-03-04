
var config = {
  type: Phaser.AUTO,
  width: 824,
  height: 412,
  pixelArt: false,
  physics: {
    default: 'matter',
    matter:{
      debug: true,
      gravity:{
        x:0,
        y:4
      }
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
