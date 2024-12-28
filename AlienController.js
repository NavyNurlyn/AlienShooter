import Alien from "./Alien.js";
import ArahGerak from "./ArahGerak.js";

export default class AlienController {
  enemyMap = [
    [1, 1, 4, 4, 4, 4, 4, 4, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [2, 2, 2, 3, 3, 3, 3, 2, 2, 2],
    [2, 2, 2, 3, 3, 3, 3, 2, 2, 2],
    [4, 4, 4, 1, 1, 1, 1, 4, 4, 4],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  ];

  //untuk menyimpan alien yang masih aktif
  enemyRows = [];
  score = 0;

  // saat pertama load canvas, objectnya masih diem, jadi kecepatannya 0. kalau kecepatan 0, dijadikan defaultnya menjadi 1
  currentDirection = ArahGerak.right;
  xVelocity = 0;
  yVelocity = 0;
  defaultXVelocity = 1;
  defaultYVelocity = 1;

  // saat pertama, waktu pergerakan musuh ke bawah itu masih 0 (soalnya juga, di line 19, itu geraknya ke kanan)
  moveDownTimerDefault = 0;

  //Pada kode tersebut, moveDownTimerDefault adalah nilai default untuk moveDownTimer. Ketika moveDownTimer diatur ulang dengan nilai moveDownTimerDefault, itu berarti pengaturan ulang moveDownTimer ke nilai default awalnya. Meskipun nilai moveDownTimerDefault diatur ke 0, biasanya nilai ini akan diubah saat konstruktor dijalankan berdasarkan level permainan yang dipilih. Sehingga, nilai default untuk moveDownTimer akan disesuaikan dengan level permainan yang dipilih, bukan selalu 0.
  moveDownTimer = this.moveDownTimerDefault;

  //nilai fireBulletTimerDefault menentukan seberapa sering alien dapat menembakkan peluru dalam setiap interval game loop.
  fireBulletTimerDefault = 30;
  fireBulletTimer = this.fireBulletTimerDefault;

  constructor(
    canvas,
    enemyBulletController,
    playerBulletController,
    levelSelect
  ) {
    // menentukan waktu turun berdasarkan level
    this.setMoveDownTimerDefault(levelSelect);

    this.canvas = canvas;
    this.enemyBulletController = enemyBulletController;
    this.playerBulletController = playerBulletController;
    this.levelSelect = levelSelect;
    this.enemyDeathSound = new Audio("sounds/enemy-death.wav");
    this.enemyDeathSound.volume = 0.1;

    // (penjelasan di fungsinya)
    this.createEnemies();
  }

  // Jika waktu antara pergerakan ke bawah lebih lama (nilai default yang lebih besar), musuh akan memiliki lebih banyak waktu untuk menempuh jarak vertikal yang lebih besar sebelum bergerak ke bawah lagi.
  setMoveDownTimerDefault(levelSelect) {
    if (levelSelect == "easy") {
      this.moveDownTimerDefault = 30;
    }
    if (levelSelect == "medium") {
      this.moveDownTimerDefault = 45;
    }
    if (levelSelect == "hard") {
      this.moveDownTimerDefault = 60;
    }
    if (levelSelect == "veryhard") {
      this.moveDownTimerDefault = 100;
    }
  }

  draw(ctx) {
    this.decrementMoveDownTimer();
    this.updateVelocityAndDirection();
    this.collisionDetection();
    this.drawEnemies(ctx);
    this.resetMoveDownTimer();
    this.fireBullet();
  }

  collisionDetection() {
    //looping dari setiap enemyRows (baris)
    this.enemyRows.forEach((enemyRow) => {
      // enemy = object , setiap enemy punya index
      // looping dari setiap index di baris (yang ada di enemyRows)
      enemyRow.forEach((enemy, enemyIndex) => {
        if (this.playerBulletController.collideWith(enemy)) {
          this.enemyDeathSound.currentTime = 0;
          this.enemyDeathSound.play();
          enemyRow.splice(enemyIndex, 1);
          this.score++; // Tambahkan skor setelah deteksi collision
          this.displayScore(); // Tampilkan skor setelah bertambah
        }
      });
    });

    this.enemyRows = this.enemyRows.filter((enemyRow) => enemyRow.length > 0);
  }

  displayScore() {
    const scoreElement = document.getElementById("score"); // Ambil elemen di HTML untuk menampilkan skor
    if (scoreElement) {
      scoreElement.innerText = `${this.score}`; // Tampilkan skor dalam teks biasa
    }
  }

  fireBullet() {
    this.fireBulletTimer--;
    if (this.fireBulletTimer <= 0) {
      this.fireBulletTimer = this.fireBulletTimerDefault;

      const allEnemies = this.enemyRows.flat();
      const enemyIndex = Math.floor(Math.random() * allEnemies.length);
      const enemy = allEnemies[enemyIndex];
      this.enemyBulletController.shoot(enemy.x + enemy.width / 2, enemy.y, -3);
    }
  }

  resetMoveDownTimer(levelSelect) {
    if (this.moveDownTimer <= 0) {
      this.moveDownTimer = this.moveDownTimerDefault;
    }
  }

  decrementMoveDownTimer() {
    // cuma menghitung moveDownTimer-- ketika geraknya ke bawah
    if (
      this.currentDirection === ArahGerak.downLeft ||
      this.currentDirection === ArahGerak.downRight
    ) {
      this.moveDownTimer--;
    }
  }

  // Kode ini mengatur perubahan kecepatan dan arah pergerakan musuh di dalam permainan
  updateVelocityAndDirection() {
    for (const enemyRow of this.enemyRows) {
      //Jika currentDirection adalah ArahGerak.right, maka musuh akan bergerak ke kanan (xVelocity positif) dan tidak bergerak secara vertikal (yVelocity 0).
      if (this.currentDirection == ArahGerak.right) {
        this.xVelocity = this.defaultXVelocity;
        this.yVelocity = 0;
        const rightMostEnemy = enemyRow[enemyRow.length - 1];

        //Jika musuh terdapat di tepi kanan layar, currentDirection diubah menjadi ArahGerak.downLeft sehingga musuh akan bergerak ke bawah ke arah kiri.
        if (rightMostEnemy.x + rightMostEnemy.width >= this.canvas.width) {
          this.currentDirection = ArahGerak.downLeft;
          break;
        }
      }

      //Jika currentDirection adalah ArahGerak.left, maka musuh akan bergerak ke kiri (xVelocity negatif) dan tidak bergerak secara vertikal (yVelocity 0).
      else if (this.currentDirection === ArahGerak.downLeft) {
        if (this.moveDown(ArahGerak.left)) {
          break;
        }
      }

      // Jika currentDirection adalah ArahGerak.left, maka musuh akan bergerak ke kiri (xVelocity negatif) dan tidak bergerak secara vertikal (yVelocity 0).
      else if (this.currentDirection === ArahGerak.left) {
        this.xVelocity = -this.defaultXVelocity;
        this.yVelocity = 0;
        const leftMostEnemy = enemyRow[0];

        // Jika musuh terdapat di tepi kiri layar, currentDirection diubah menjadi ArahGerak.downRight sehingga musuh akan bergerak ke bawah ke arah kanan.
        if (leftMostEnemy.x <= 0) {
          this.currentDirection = ArahGerak.downRight;
          break;
        }
      }

      // Jika musuh sudah mencapai batas kanan layar, pergerakan ke bawah ke kanan dihentikan.
      else if (this.currentDirection === ArahGerak.downRight) {
        if (this.moveDown(ArahGerak.right)) {
          break;
        }
      }
    }
  }

  //Metode moveDown(newDirection) digunakan untuk mengatur pergerakan alien ke bawah. Pada awalnya, method ini mengatur kecepatan horizontal (xVelocity) menjadi 0 dan kecepatan vertikal (yVelocity) menjadi nilai defaultYVelocity. Jika timer pergerakan ke bawah (moveDownTimer) sudah mencapai 0 atau kurang, maka arah pergerakan saat ini akan diubah menjadi arah baru yang diberikan sebagai parameter (newDirection) dan method ini akan mengembalikan nilai true. Jika timer masih di atas 0, maka method ini akan mengembalikan nilai false.
  moveDown(newDirection) {
    this.xVelocity = 0;
    this.yVelocity = this.defaultYVelocity;
    if (this.moveDownTimer <= 0) {
      this.currentDirection = newDirection;
      return true;
    }
    return false;
  }

  checkEnemyReachedBottom() {
    const canvasBottom = this.canvas.height;

    // Pertama-tama, kita inisialisasi bottomMostEnemy dengan nilai awal 0.
    // Selanjutnya, kita iterasi melalui setiap baris alien dengan menggunakan reduce().
    const bottomMostEnemy = this.enemyRows.reduce((acc, row) => {
      // Pada setiap iterasi, kita periksa apakah baris tersebut tidak kosong (row.length > 0). Jika tidak kosong, kita cari alien terbawah pada baris tersebut.
      if (row.length > 0) {
        // Math.max(acc, ...): Di sini kita bandingkan nilai sekarang dari acc (yang dimulai dengan 0) dengan posisi vertikal paling bawah alien dalam baris saat ini. Fungsi Math.max() mengembalikan nilai tertinggi dari kedua nilai tersebut.
        return Math.max(
          acc,
          row[row.length - 1].y + row[row.length - 1].height
          // row[row.length - 1] mengambil alien terakhir dalam baris tersebut (karena indeks terakhir menunjukkan alien terbawah dalam baris).
          // row[row.length - 1].y + row[row.length - 1].height menghitung posisi vertikal (y) dari alien terbawah, ditambah dengan tinggi (height) alien tersebut. Ini memberi kita posisi vertikal paling bawah alien dalam baris.
        );
      }
      return acc;
    }, 0);

    // Nilai tertinggi dari posisi vertikal paling bawah alien dalam semua baris akhirnya disimpan dalam variabel bottomMostEnemy.
    return bottomMostEnemy >= canvasBottom;
  }

  // memperbarui posisi alien
  drawEnemies(ctx) {
    this.enemyRows.flat().forEach((enemy) => {
      // Setiap musuh dipindahkan (bergerak) sesuai dengan kecepatan saat ini yang diatur oleh this.xVelocity dan this.yVelocity, dan kemudian digambar ke dalam canvas menggunakan metode draw(ctx) yang didefinisikan dalam kelas Alien atau Enemy.
      enemy.move(this.xVelocity, this.yVelocity);
      enemy.draw(ctx);
    });
  }

  // membuat alien pertamakali saat di load
  createEnemies() {
    this.enemyMap.forEach((row, rowIndex) => {
      this.enemyRows[rowIndex] = [];
      row.forEach((enemyNumber, enemyIndex) => {
        if (enemyNumber > 0) {
          // membuat objek Alien baru dengan koordinat x dan y yang sesuai dengan indeks baris (rowIndex) dan kolom (enemyIndex), dan nomor musuh tersebut. Koordinat x dihitung dengan mengalikan enemyIndex dengan lebar musuh (dalam contoh ini, 50), sedangkan koordinat y dihitung dengan mengalikan rowIndex dengan tinggi musuh (dalam contoh ini, 35)
          this.enemyRows[rowIndex].push(
            new Alien(enemyIndex * 50, rowIndex * 35, enemyNumber)
          );
        }
      });
    });
  }

  //sprite = objek yang mungkin bertabrakan dengan alien / enemy (contoh : roket/ peluru)
  collideWith(sprite) {
    return this.enemyRows.flat().some((enemy) => enemy.collideWith(sprite));
  }
}
