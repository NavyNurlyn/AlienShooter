export default class Alien {
  // dipanggilnya di AlienController.js line 230
  constructor(x, y, imageNumber) {
    this.x = x;
    this.y = y;
    this.width = 44;
    this.height = 32;

    this.image = new Image();
    this.image.src = `images/mon${imageNumber}.png`;
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  // untuk memindahkan posisi alien sesuai dengan kecepatan horizontal (xVelocity) dan kecepatan vertikal (yVelocity) yang diberikan
  move(xVelocity, yVelocity) {
    this.x += xVelocity;
    this.y += yVelocity;
  }

  collideWith(sprite) {
    if (
      // Pertama, kita periksa apakah sisi kanan objek A (this.x + this.width) berada di sebelah kiri sisi kiri objek B (sprite.x). Jika ya, berarti objek A berada di sebelah kiri objek B dan tidak ada tabrakan.
      this.x + this.width > sprite.x &&
      // Kemudian, kita periksa apakah sisi kiri objek A (this.x) berada di sebelah kanan sisi kanan objek B (sprite.x + sprite.width). Jika ya, berarti objek A berada di sebelah kanan objek B dan tidak ada tabrakan.
      this.x < sprite.x + sprite.width &&
      // Selanjutnya, kita periksa apakah sisi bawah objek A (this.y + this.height) berada di atas sisi atas objek B (sprite.y). Jika ya, berarti objek A berada di atas objek B dan tidak ada tabrakan.
      this.y + this.height > sprite.y &&
      // Terakhir, kita periksa apakah sisi atas objek A (this.y) berada di bawah sisi bawah objek B (sprite.y + sprite.height). Jika ya, berarti objek A berada di bawah objek B dan tidak ada tabrakan.
      this.y < sprite.y + sprite.height
    ) {
      // Jika semua kondisi di atas tidak terpenuhi, maka kedua objek saling bersentuhan dan metode collideWith(sprite) akan mengembalikan nilai true, menandakan bahwa ada tabrakan antara objek A dan objek B. Jika salah satu kondisi terpenuhi, maka metode akan mengembalikan nilai false, menandakan bahwa tidak ada tabrakan antara kedua objek tersebut.
      return true;
    } else {
      return false;
    }
  }
}
