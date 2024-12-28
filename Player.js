export default class Player {
  rightPressed = false;
  leftPressed = false;
  shootPressed = false;

  constructor(canvas, velocity, bulletController) {
    this.canvas = canvas;
    this.velocity = velocity;
    this.bulletController = bulletController;

    this.x = this.canvas.width / 2;
    this.y = this.canvas.height - 75;
    this.width = 50;
    this.height = 48;
    this.image = new Image();
    this.image.src = "images/player.png";

    document.addEventListener("keydown", this.keydown);
    document.addEventListener("keyup", this.keyup);
  }

  draw(ctx) {
    //ketika button space ditekan,
    if (this.shootPressed) {
      this.bulletController.shoot(this.x + this.width / 2, this.y, 4, 10);
    }
    this.move();
    this.collideWithWalls();
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  collideWithWalls() {
    //left
    // memeriksa apakah pemain telah melewati batas layar ke kiri (koordinat x kurang dari 0). Jika demikian, artinya pemain telah mencapai atau melewati batas layar sebelah kiri.
    if (this.x < 0) {
      //Jika pemain telah melewati batas layar sebelah kiri, maka posisi x pemain diatur kembali ke 0. Ini berarti pemain akan ditempatkan tepat di batas layar kiri.
      this.x = 0;
    }

    //right
    // memeriksa apakah pemain telah melewati batas layar ke kanan.
    // (this.canvas.width - this.width) menghitung batas maksimal yang dapat dicapai pemain di sebelah kanan layar, dengan memperhitungkan lebar pemain.
    if (this.x > this.canvas.width - this.width) {
      // Jika pemain telah melewati batas layar sebelah kanan, maka posisi x pemain diatur kembali ke titik yang sejajar dengan batas kanan layar, dikurangi dengan lebar pemain. Ini memastikan bahwa pemain tidak melewati batas layar sebelah kanan.
      this.x = this.canvas.width - this.width;
    }
  }

  move() {
    if (this.rightPressed) {
      this.x += this.velocity;
    } else if (this.leftPressed) {
      this.x += -this.velocity;
    }
  }

  keydown = (event) => {
    if (event.code == "ArrowRight") {
      this.rightPressed = true;
    }
    if (event.code == "ArrowLeft") {
      this.leftPressed = true;
    }
    if (event.code == "Space") {
      this.shootPressed = true;
    }
  };

  keyup = (event) => {
    if (event.code == "ArrowRight") {
      this.rightPressed = false;
    }
    if (event.code == "ArrowLeft") {
      this.leftPressed = false;
    }
    if (event.code == "Space") {
      this.shootPressed = false;
    }
  };
}
