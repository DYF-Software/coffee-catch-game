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
    height: 100,
    level: 0 // Start with empty cup
};

let drops = [];

// Event listener to move cup with mouse
canvas.addEventListener("mousemove", (event) => {
    cup.x = event.clientX - cup.width / 2;
});

function spawnDrop() {
    drops.push({
        x: Math.random() * (canvas.width - 30),
        y: 0,
        width: 30,
        height: 30,
        speed: 3
    });
}

setInterval(spawnDrop, 1000); // Spawn a drop every second

function update() {
    // Move drops
    drops.forEach(drop => drop.y += drop.speed);
    
    // Check for collisions
    drops = drops.filter(drop => {
        if (
            drop.y + drop.height >= cup.y &&
            drop.x + drop.width >= cup.x &&
            drop.x <= cup.x + cup.width
        ) {
            if (cup.level < cupLevels.length - 1) {
                cup.level++;
            }
            return false; // Remove drop after collision
        }
        return drop.y < canvas.height; // Remove if it falls out
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw drops
    drops.forEach(drop => ctx.drawImage(coffeeDrop, drop.x, drop.y, drop.width, drop.height));
    
    // Draw cup
    ctx.drawImage(cupLevels[cup.level], cup.x, cup.y, cup.width, cup.height);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
