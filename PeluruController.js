import Peluru from "./Peluru.js";

// dipanggil di script.js untuk 2 jenis peluru (alien & pesawat/player)
export default class PeluruController {
  bullets = [];
  timeTillNextBulletAllowed = 0;

  constructor(canvas, maxBulletsAtATime, bulletColor, soundEnabled) {
    this.canvas = canvas;
    this.maxBulletsAtATime = maxBulletsAtATime;
    this.bulletColor = bulletColor;
    this.soundEnabled = soundEnabled;

    this.shootSound = new Audio("sounds/shoot.wav");
    this.shootSound.volume = 0.1;
  }

  draw(ctx) {
    // Dalam filter tersebut, setiap peluru akan diuji untuk melihat apakah masih berada di dalam kanvas permainan (diberikan oleh kondisi bullet.y + bullet.width > 0 && bullet.y <= this.canvas.height). Peluru yang masih dalam batas kanvas akan disimpan kembali dalam array bullets.
    this.bullets = this.bullets.filter(
      (bullet) => bullet.y + bullet.width > 0 && bullet.y <= this.canvas.height
    );

    // Setelah peluru-peluru yang tidak aktif dihapus, langkah berikutnya adalah menggambar setiap peluru yang tersisa. Ini dilakukan dengan menggunakan metode forEach pada array bullets, di mana setiap peluru dijalankan metode draw-nya untuk digambar pada konteks ctx.
    this.bullets.forEach((bullet) => bullet.draw(ctx));
    // memeriksa apakah ada penundaan waktu yang diterapkan sebelum peluru berikutnya dapat ditembakkan, untuk mengatur frekuensi penembakan peluru, sehingga tidak terlalu sering.
    if (this.timeTillNextBulletAllowed > 0) {
      this.timeTillNextBulletAllowed--;
    }
  }

  collideWith(sprite) {
    //mencari indeks peluru yang menabrak dg sprite
    const bulletThatHitSpriteIndex = this.bullets.findIndex((bullet) =>
      bullet.collideWith(sprite)
    );

    // kalau peluru nabrak, akan dihapus dari array bullets
    if (bulletThatHitSpriteIndex >= 0) {
      this.bullets.splice(bulletThatHitSpriteIndex, 1);
      return true;
    }

    return false;
  }

  // parameter timeTillNextBulletAllowed tidak diberi nilai selain 0 secara eksplisit. Oleh karena itu, waktu penundaan akan selalu 0 dalam kondisi tersebut.
  // Namun, dalam implementasi metode shoot, terdapat pengecekan yang memperhatikan nilai timeTillNextBulletAllowed, yang mana dalam kode tersebut dipastikan bahwa nilai timeTillNextBulletAllowed akan tetap diakses, meskipun nilainya selalu 0.
  // Jadi, meskipun tidak ada kasus di mana timeTillNextBulletAllowed diberikan nilai selain 0, pengecekan tersebut mencegah peluru ditembakkan terlalu sering dengan memeriksa kondisi waktu penundaan sebelum menembakkan peluru baru.
  shoot(x, y, velocity, timeTillNextBulletAllowed = 0) {
    if (
      this.timeTillNextBulletAllowed <= 0 &&
      this.bullets.length < this.maxBulletsAtATime
    ) {
      const bullet = new Peluru(this.canvas, x, y, velocity, this.bulletColor);
      this.bullets.push(bullet);
      if (this.soundEnabled) {
        this.shootSound.currentTime = 0;
        this.shootSound.play();
      }
      this.timeTillNextBulletAllowed = timeTillNextBulletAllowed;
    }
  }
}
