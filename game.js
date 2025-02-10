const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Load images
const cupLevels = ["./assets/level-1.png", "./assets/level-2.png", "./assets/level-3.png", "./assets/level-4.png"].map(src => {
    const img = new Image();
    img.src = src;
    return img;
});
const coffeeDrop = new Image();
coffeeDrop.src = "./assets/cofee-drop.png";

let cup = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 150,
    width: 100,
    height: 100
};

let drops = [];
let score = 0; // Oyuncu puanı
let gameRunning = true; // Oyun devam ediyor mu?

// Mouse hareketi için
canvas.addEventListener("mousemove", (event) => {
    cup.x = event.clientX - cup.width / 2;
});

// Dokunmatik ekranlar için hareket desteği
canvas.addEventListener("touchmove", (event) => {
    event.preventDefault(); // Sayfanın kaymasını engelle
    let touch = event.touches[0]; // İlk dokunma noktası
    cup.x = touch.clientX - cup.width / 2;
});

function spawnDrop() {
    if (gameRunning) {
        drops.push({
            x: Math.random() * (canvas.width - 30),
            y: 0,
            width: 30,
            height: 30,
            speed: 3
        });
    }
}

setInterval(spawnDrop, 1000); // Her saniyede bir damla oluştur

function update() {
    if (!gameRunning) return; // Oyun bittiyse güncellemeyi durdur

    // Damlaları hareket ettir
    drops.forEach(drop => drop.y += drop.speed);
    
    // Çarpışmaları kontrol et
    drops = drops.filter(drop => {
        if (
            drop.y + drop.height >= cup.y &&
            drop.x + drop.width >= cup.x &&
            drop.x <= cup.x + cup.width
        ) {
            score += 10; // Yakalanan her damla için +10 puan
            return false; // Çarpışan damlayı kaldır
        }
        if (drop.y >= canvas.height) {
            score -= 5; // Kaçan her damla için -5 puan
            if (score < 0) score = 0; // Puan negatif olamaz
            return false; // Ekranın dışına çıkan damlayı kaldır
        }
        return true;
    });

    // Puan aralıklarına göre kupa seviyesini ayarla
     if (score >= 60) {
        cup.level = 3;
    } else if (score >= 40) {
        cup.level = 2;
    } else if (score >= 20) {
        cup.level = 1;
    } else {
        cup.level = 0;
    }

    // Oyun bitirme kontrolü
    if (score >= 100) {
        gameRunning = false; // Oyunu durdur
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Puanı çiz
    ctx.fillStyle = "#000";
    ctx.font = "24px Arial";
    ctx.fillText("Score: " + score, 20, 40); // Sol üst köşe
    
    // Kupayı çiz
    ctx.drawImage(cupLevels[cup.level], cup.x, cup.y, cup.width, cup.height);
    
    // Damlaları çiz
    drops.forEach(drop => ctx.drawImage(coffeeDrop, drop.x, drop.y, drop.width, drop.height));

    // Oyun bittiğinde "You Win!" mesajı göster
    if (!gameRunning) {
        ctx.fillStyle = "#000";
        ctx.font = "48px Arial";
        ctx.fillText("YOU WIN!", canvas.width / 2 - 100, canvas.height / 2);
    }
}

function gameLoop() {
    update();
    draw();
    if (gameRunning) {
        requestAnimationFrame(gameLoop);
    }
}

gameLoop();
