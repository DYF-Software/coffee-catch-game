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
let dragging = false; // Mobil için sürükleme kontrolü

// Mouse hareketi için
canvas.addEventListener("mousemove", (event) => {
    cup.x = event.clientX - cup.width / 2;
});

// Dokunmatik ekranlar için sürükleme desteği
canvas.addEventListener("touchstart", (event) => {
    let touch = event.touches[0]; // İlk dokunma noktası
    if (
        touch.clientX >= cup.x &&
        touch.clientX <= cup.x + cup.width &&
        touch.clientY >= cup.y &&
        touch.clientY <= cup.y + cup.height
    ) {
        dragging = true; // Eğer kupa dokunulduysa sürüklemeyi başlat
    }
});

canvas.addEventListener("touchmove", (event) => {
    if (dragging) {
        event.preventDefault(); // Sayfanın kaymasını engelle
        let touch = event.touches[0];
        cup.x = touch.clientX - cup.width / 2;
    }
});

canvas.addEventListener("touchend", () => {
    dragging = false; // Parmağı kaldırınca sürükleme dursun
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
 if (score >= 80) {
        cup.level = 3;
    } else if (score >= 60) {
        cup.level = 2;
    } else if (score >= 30) {
        cup.level = 1;
    } else {
        cup.level = 0;
    }

    // Oyun bitirme kontrolü
    if (score >= 100 && gameRunning) {
        gameRunning = false; // Oyunu durdur
        showWinPopup(); // Kazanma popup'ını göster
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
}

function gameLoop() {
    update();
    draw();
    if (gameRunning) {
        requestAnimationFrame(gameLoop);
    }
}

gameLoop();

// KAZANMA POPUP'INI OLUŞTUR
function showWinPopup() {
    // Popup arka planı
    let popup = document.createElement("div");
    popup.id = "winPopup";
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.background = "white";
    popup.style.padding = "20px";
    popup.style.borderRadius = "10px";
    popup.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.2)";
    popup.style.textAlign = "center";

    // Başlık
    let title = document.createElement("h2");
    title.innerText = "🎉 Tebrikler! Kupon Kazandınız! 🎉";
    popup.appendChild(title);

    // Kupon kodu
    let couponCode = document.createElement("p");
    couponCode.id = "couponCode";
    couponCode.innerText = "COFFEE2024";
    couponCode.style.fontSize = "20px";
    couponCode.style.fontWeight = "bold";
    couponCode.style.background = "#eee";
    couponCode.style.padding = "10px";
    couponCode.style.borderRadius = "5px";
    popup.appendChild(couponCode);

    // Kopyala Butonu
    let copyButton = document.createElement("button");
    copyButton.innerText = "Kopyala";
    copyButton.style.marginTop = "10px";
    copyButton.style.padding = "10px";
    copyButton.style.fontSize = "16px";
    copyButton.style.border = "none";
    copyButton.style.background = "#4CAF50";
    copyButton.style.color = "white";
    copyButton.style.borderRadius = "5px";
    copyButton.style.cursor = "pointer";

    copyButton.onclick = function () {
        navigator.clipboard.writeText(couponCode.innerText);
        alert("Kupon Kopyalandı!");
    };

    popup.appendChild(copyButton);

    document.body.appendChild(popup);
}
