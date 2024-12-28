import AlienController from "./AlienController.js";
import Player from "./Player.js";
import PeluruController from "./PeluruController.js";

// mengambil elemen-elemen HTML
const playerNameInput = document.getElementById("player-name"); // nama pemain
const levelSelect = document.getElementById("level-select"); // level inputan/dipilih
const startButton = document.getElementById("start-button"); // button start / mulai
const gameStartDiv = document.getElementById("game-start"); // halaman pertama
const gameCanvas = document.getElementById("game"); // halaman game (canvas)
const tampilskor = document.getElementById("score"); // skor
const showLevelElement = document.getElementById("showlevel"); // teks elemen level dipilih
const backBtn = document.getElementById("back_btn"); // button kembali ke home
const ctx = gameCanvas.getContext("2d"); // konteks 2D dari elemen <canvas>
let gameStarted = false; // Variabel untuk mengindikasikan apakah permainan sudah dimulai atau belum

// Sembunyikan canvas saat halaman dimuat
gameCanvas.style.display = "none";
tampilskor.style.display = "none";
document.querySelectorAll(".konten-game > *").forEach((element) => {
  element.style.display = "none";
});

// Menambahkan event listener untuk tombol Start
startButton.addEventListener("click", startGame);

// Fungsi untuk memulai permainan
function startGame() {
  if (!gameStarted) {
    // Memastikan bahwa game belum dimulai
    const playerName = playerNameInput.value;
    const selectedLevel = levelSelect.value; // Memperbarui nilai levelSelect di sini

    // Sembunyikan halaman awal dan tampilkan canvas
    gameStartDiv.style.display = "none";
    gameCanvas.style.display = "block";
    tampilskor.style.display = "block";

    document.querySelectorAll(".konten-game > *").forEach((element) => {
      element.style.display = "block";
    });

    // menampilkan teks elemen pilihan level
    if (selectedLevel === "veryhard") {
      showLevelElement.textContent = "Very Hard";
    } else {
      showLevelElement.textContent =
        selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1);
    }
    const startSound = new Audio("sounds/start-click.wav");
    startSound.play();
    // Mulai permainan dengan nama pemain dan level yang dipilih
    startNewGame(playerName, selectedLevel); // Memanggil startNewGame() dengan level yang diperbarui
    gameStarted = true; // Setel gameStarted menjadi true setelah permainan dimulai
  }
}

// Fungsi untuk memulai permainan dengan nama pemain dan level yang dipilih
function startNewGame(playerName, level) {
  const canvas = document.getElementById("game");

  canvas.width = 600;
  canvas.height = 600;

  const background = new Image();
  background.src = "images/space.png";

  const playerBulletController = new PeluruController(canvas, 10, "red", true);
  const enemyBulletController = new PeluruController(canvas, 4, "white", false);
  const enemyController = new AlienController(
    canvas,
    enemyBulletController,
    playerBulletController,
    level
  );
  enemyController.levelSelect = level;
  // 3 adalah velocity / kecepatan player
  const player = new Player(canvas, 3, playerBulletController);

  let isGameOver = false;
  let didWin = false;

  function game() {
    checkGameOver();
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    if (!isGameOver) {
      player.draw(ctx);
      playerBulletController.draw(ctx);
      enemyBulletController.draw(ctx);
      enemyController.draw(ctx);
    }
    displayGameOver(enemyController.score);
  }

  function displayGameOver(score) {
    if (isGameOver) {
      let playerName = playerNameInput.value.trim();
      let text = didWin ? `Congrats! You Win` : `Game Over, `;
      let textname = `${playerName}`;
      let textScore = `Score: ${score}`;

      ctx.fillStyle = "white";
      ctx.font = "55px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.fillText(text, canvas.width / 2, canvas.height / 2.5);
      ctx.fillText(textname, canvas.width / 2, canvas.height / 2);
      ctx.fillText(textScore, canvas.width / 2, canvas.height / 1.5); // Menampilkan skor di tengah canvas

      // Memeriksa apakah game dimenangkan atau kalah dan memainkan suara yang sesuai
     
    }
  }

  function checkGameOver() {
    if (isGameOver) {
      return;
      document.getElementById("game-over-sound").play()
    }

    // kalau peluru alien mengenai pesawat/player
    if (enemyBulletController.collideWith(player)) {
      isGameOver = true;
      document.getElementById("game-over-sound").play()
    }

    // kalau alien mengenai / bertabrakan dengan pesawat/ player
    if (enemyController.collideWith(player)) {
      isGameOver = true;
      document.getElementById("game-over-sound").play()
    }

    // kalau objek alien sudah habis
    if (enemyController.enemyRows.length === 0) {
      didWin = true;
      isGameOver = true;
      document.getElementById("win-sound").play();
    }

    // kalau alien mencapai batas bawah canvas
    if (enemyController.checkEnemyReachedBottom()) {
      isGameOver = true;
      document.getElementById("game-over-sound").play()
    }
  }

  //setInterval(game, 1000 / 60); merupakan implementasi dari game loop. Itu memanggil fungsi game() sebanyak mungkin, dengan target 60 kali per detik (1000 / 60 milidetik per frame). Dalam setiap iterasi game loop, logika permainan diperbarui, penggambaran dilakukan, dan waktu disinkronkan.
  setInterval(game, 1000 / 60);
}

// Deklarasi variabel-variabel global lainnya
const backSound = new Audio("sounds/start-click.wav");
backSound.volume = 0.1; // Atur volume suara jika diperlukan

// Menambahkan event listener untuk tombol back_Btn
backBtn.addEventListener("click", () => {
  backSound.currentTime = 0; // Mengatur waktu audio ke awal (jika ingin memainkan suara dari awal setiap kali tombol diklik)
  backSound.play(); // Memainkan suara saat tombol diklik
  location.reload(); // Mengembalikan halaman atau melakukan tindakan lainnya sesuai dengan kebutuhan Anda
});
