export default class Peluru {
  // dipanggil di PeluruController.js line 46
  // membuat peluru membutuhkan ukuran canvas, koordinat objek yg mengeluarkan peluru, kecepatan objek, dan warna peluru (jenis/ objek yg mengeluarkan)
  constructor(canvas, x, y, velocity, bulletColor) {
    this.canvas = canvas;
    this.x = x;
    this.y = y;
    this.velocity = velocity;
    this.bulletColor = bulletColor;

    this.width = 5;
    this.height = 20;
  }

  // untuk menggambar peluru pada area permainan menggunakan objek ctx (biasanya objek konteks 2D dari elemen canvas)
  draw(ctx) {
    //Baris ini mengurangi nilai y dari posisi peluru dengan kecepatan (velocity) peluru. Ini menghasilkan pergerakan peluru ke atas di dalam area permainan. Karena koordinat y dalam elemen canvas dimulai dari bagian atas (0 di bagian atas dan bertambah ke bawah), pengurangan ini berarti peluru akan bergerak ke arah atas dalam koordinat canvas.
    this.y -= this.velocity;
    //  Baris ini menetapkan warna isi dari objek konteks ctx menjadi warna yang diberikan oleh properti bulletColor dari objek peluru. Ini akan mempengaruhi warna peluru saat diisi nanti.
    ctx.fillStyle = this.bulletColor;
    // Baris ini menggambar peluru sebagai persegi panjang di posisi (this.x, this.y) dengan lebar this.width dan tinggi this.height menggunakan warna yang telah ditetapkan sebelumnya. Ini adalah cara standar untuk menggambar bentuk di dalam elemen canvas menggunakan objek konteks 2D.
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  collideWith(sprite) {
    if (
      this.x + this.width > sprite.x &&
      this.x < sprite.x + sprite.width &&
      this.y + this.height > sprite.y &&
      this.y < sprite.y + sprite.height
    ) {
      return true;
    } else {
      return false;
    }
  }
}
