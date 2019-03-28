class SceneLoader extends Phaser.Scene{
  constructor(){
    super("loader")
  }
  preload(){
    console.log(this);
    this.createProgressBar.call(this)

    // All Main Assets are loaded here



    this.load.image('1Heavy', 'assets/ship_blue_heavy.png');
    this.load.image('2Heavy', 'assets/ship_red_heavy.png');
    this.load.image('1Light', 'assets/ship_blue_light.png');
    this.load.image('2Light', 'assets/ship_red_light.png');
    this.load.image('1Home' , 'assets/home_blue.png');
    this.load.image('2Home' , 'assets/home_red.png');
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
            font: '18px monospace',
            fill: '#ffffff'
        }
    });
    percentText.setOrigin(0.5, 0.5);

    var assetText = this.make.text({
        x: width / 2,
        y: height / 2 + 65,
        text: '',
        style: {
            font: '18px monospace',
            fill: '#ffffff'
        }
    });

    assetText.setOrigin(0.5, 0.5);

    this.load.on('progress', function (value) {
        percentText.setText(parseInt(value * 100) + '%');
        progressBar.clear();
        progressBar.fillStyle(0xffffff, 1);
        progressBar.fillRect(width / 2 - 150 , height / 2 - 15, 300 * value, 30);
    });

    this.load.on('fileprogress', function (file) {
        assetText.setText('Loading asset: ' + file.key);
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
