var resources = [
  ['heavy-fighter-red' , 'assets/ships/red/enemyRed4.png'],
  ['heavy-fighter-blue', 'assets/ships/blue/enemyBlue4.png'],
  ['light-fighter-red' , 'assets/ships/red/enemyRed3.png'],
  ['light-fighter-blue', 'assets/ships/blue/enemyBlue3.png'],
  ['home-base-red'     , 'assets/buildings/home_blue.png'],
  ['home-base-blue'    , 'assets/buildings/home_red.png'],
  ['missle-red', 'assets/missles/spaceMissiles_009.png'],
  ['missle-blue', 'assets/missles/spaceMissiles_010.png']
]
class SceneLoader extends Phaser.Scene{
  constructor(){
    super("loader")
  }
  preload(){
    console.log(this);
    this.createProgressBar.call(this)
    // All Main Assets are loaded here

    resources.forEach((texture)=>{
      this.load.image(texture[0], texture[1])
    }, this)


  }
  create(){

  }
  update(){

  }

  createProgressBar(){
    var progressBar = this.add.graphics();

    var width = this.cameras.main.width;
    var height = this.cameras.main.height;

    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 -160 , height / 2 - 25, 320, 50);

    var loadingText = this.make.text({
        x: width / 2,
        y: height / 2 - 50,
        text: 'Loading...',
        style: {
            font: '20px monospace',
            fill: '#ffffff'
        }
    });
    loadingText.setOrigin(0.5, 0.5);

    var percentText = this.make.text({
        x: width / 2,
        y: height / 2 - 5,
        text: '0%',
        style: {
            font: '30px monospace',
            fill: '#ffffff'
        }
    });
    percentText.setOrigin(0.5, 0.5);

    var assetText = this.make.text({
        x: width / 2,
        y: height / 2 - 5,
        text: '',
        style: {
            font: '100px monospace',
            fill: '#ffffff'
        }
    });
    console.log(assetText);
    assetText.setOrigin(0.5, 0.5);

    this.load.on('progress', function (value) {
        percentText.setText(parseInt(value * 100) + '%');
        progressBar.clear();
        progressBar.fillStyle(0xffffff, 1);
        progressBar.fillRect(width / 2 - 150 , height / 2 - 15, 300 * value, 30);
    });

    this.load.on('fileprogress', function (file) {
                assetText.setText('Loading asset: ' + file.src);
    });

    this.load.on('complete', function () {
        progressBar.destroy();
        progressBox.destroy();
        loadingText.destroy();
        percentText.destroy();
        assetText.destroy();
        this.scene.switch("mainmenu")
    }, this);
  }
}
