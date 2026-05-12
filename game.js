// ===== Canvas Setup =====
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const GRAVITY = 0.5;
const GROUND_Y = 350;
const MAP_WIDTH = 2400;

// ===== ข้อมูลทุก Level =====
const levels = [
  {
    goalDimension: "alt",
    normal: {
      platforms: [
        { x: 60,   y: 300, width: 100, height: 15 },
        { x: 260,  y: 270, width: 60,  height: 15 },
        { x: 500,  y: 250, width: 60,  height: 15 },
        { x: 750,  y: 260, width: 60,  height: 15 },
        { x: 1000, y: 240, width: 60,  height: 15 },
        { x: 1300, y: 255, width: 60,  height: 15 },
        { x: 1600, y: 240, width: 60,  height: 15 },
        { x: 1900, y: 255, width: 60,  height: 15 },
        { x: 2150, y: 240, width: 60,  height: 15 },
      ],
      bgColor: "#16213e", platformColor: "#8B4513",
    },
    alt: {
      platforms: [
        { x: 160,  y: 245, width: 60,  height: 15 },
        { x: 380,  y: 210, width: 60,  height: 15 },
        { x: 620,  y: 230, width: 60,  height: 15 },
        { x: 870,  y: 200, width: 60,  height: 15 },
        { x: 1130, y: 215, width: 60,  height: 15 },
        { x: 1420, y: 200, width: 60,  height: 15 },
        { x: 1720, y: 210, width: 60,  height: 15 },
        { x: 2000, y: 195, width: 60,  height: 15 },
        { x: 2280, y: 180, width: 60,  height: 15 },
      ],
      bgColor: "#1a0a2e", platformColor: "#9b30ff",
    },
    goal: { x: 2320, y: 130, width: 35, height: 55 },
    startX: 80, startY: 250,
  },
  {
    goalDimension: "normal",
    normal: {
      platforms: [
        { x: 60,   y: 300, width: 100, height: 15 },
        { x: 250,  y: 260, width: 55,  height: 15 },
        { x: 480,  y: 230, width: 55,  height: 15 },
        { x: 750,  y: 245, width: 55,  height: 15 },
        { x: 1050, y: 220, width: 55,  height: 15 },
        { x: 1350, y: 240, width: 55,  height: 15 },
        { x: 1650, y: 215, width: 55,  height: 15 },
        { x: 1950, y: 230, width: 55,  height: 15 },
        { x: 2250, y: 200, width: 55,  height: 15 },
      ],
      bgColor: "#0d1b2a", platformColor: "#6B3410",
    },
    alt: {
      platforms: [
        { x: 155,  y: 240, width: 55,  height: 15 },
        { x: 365,  y: 200, width: 55,  height: 15 },
        { x: 615,  y: 215, width: 55,  height: 15 },
        { x: 900,  y: 195, width: 55,  height: 15 },
        { x: 1200, y: 210, width: 55,  height: 15 },
        { x: 1500, y: 195, width: 55,  height: 15 },
        { x: 1800, y: 205, width: 55,  height: 15 },
        { x: 2100, y: 185, width: 55,  height: 15 },
      ],
      bgColor: "#12002e", platformColor: "#7700cc",
    },
    goal: { x: 2320, y: 150, width: 35, height: 55 },
    startX: 80, startY: 250,
  },
  {
    goalDimension: "alt",
    normal: {
      platforms: [
        { x: 60,   y: 300, width: 100, height: 15 },
        { x: 240,  y: 255, width: 50,  height: 15 },
        { x: 470,  y: 225, width: 50,  height: 15 },
        { x: 730,  y: 240, width: 50,  height: 15 },
        { x: 1020, y: 210, width: 50,  height: 15 },
        { x: 1330, y: 230, width: 50,  height: 15 },
        { x: 1650, y: 205, width: 50,  height: 15 },
        { x: 1980, y: 220, width: 50,  height: 15 },
        { x: 2250, y: 195, width: 50,  height: 15 },
      ],
      bgColor: "#1a0000", platformColor: "#5a2800",
    },
    alt: {
      platforms: [
        { x: 150,  y: 235, width: 50,  height: 15 },
        { x: 355,  y: 190, width: 50,  height: 15 },
        { x: 600,  y: 210, width: 50,  height: 15 },
        { x: 875,  y: 185, width: 50,  height: 15 },
        { x: 1175, y: 200, width: 50,  height: 15 },
        { x: 1490, y: 180, width: 50,  height: 15 },
        { x: 1815, y: 195, width: 50,  height: 15 },
        { x: 2115, y: 170, width: 50,  height: 15 },
        { x: 2310, y: 150, width: 50,  height: 15 },
      ],
      bgColor: "#0a0015", platformColor: "#5500aa",
    },
    goal: { x: 2330, y: 95, width: 35, height: 55 },
    startX: 80, startY: 250,
  },
];

// ===== State =====
let currentLevel = 0;
let dimension = "normal";
let gameOver = false;
let gameClear = false;
let gameComplete = false;
let canSwitch = true;
let cameraX = 0;

// ===== ตัวละคร Oppy =====
const oppy = {
  x: 80, y: 250,
  width: 40, height: 50,
  velX: 0, velY: 0,
  speed: 5, jumpForce: -13,
  onGround: false
};

// ===== ปรับขนาด Canvas =====
function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// ===== โหลด Level =====
function loadLevel(index) {
  const lvl = levels[index];
  oppy.x = lvl.startX;
  oppy.y = lvl.startY;
  oppy.velX = 0;
  oppy.velY = 0;
  dimension = "normal";
  gameOver = false;
  gameClear = false;
  cameraX = 0;
}

// ===== ปุ่ม UI =====
const btnNextLevel   = { x: 240, y: 230, width: 150, height: 45 };
const btnRestart     = { x: 410, y: 230, width: 150, height: 45 };
const btnRestartOnly = { x: 320, y: 230, width: 160, height: 45 };

function drawButton(btn, color, text) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(btn.x, btn.y, btn.width, btn.height, 10);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 18px Arial";
  ctx.textAlign = "center";
  ctx.fillText(text, btn.x + btn.width / 2, btn.y + btn.height / 2 + 6);
  ctx.textAlign = "left";
}

function isClickInBtn(mx, my, btn) {
  return mx >= btn.x && mx <= btn.x + btn.width &&
         my >= btn.y && my <= btn.y + btn.height;
}

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  if (gameClear) {
    if (isClickInBtn(mx, my, btnNextLevel)) {
      currentLevel++;
      if (currentLevel >= levels.length) {
        gameComplete = true;
        gameClear = false;
      } else {
        loadLevel(currentLevel);
      }
    }
    if (isClickInBtn(mx, my, btnRestart)) {
      currentLevel = 0;
      gameClear = false;
      loadLevel(0);
    }
  }
  if (gameOver) {
    if (isClickInBtn(mx, my, btnRestartOnly)) loadLevel(currentLevel);
  }
  if (gameComplete) {
    if (isClickInBtn(mx, my, btnRestartOnly)) {
      currentLevel = 0;
      gameComplete = false;
      loadLevel(0);
    }
  }
});

// ===== Input คีย์บอร์ด =====
const keys = {};
document.addEventListener("keydown", (e) => {
  keys[e.code] = true;
  if (e.code === "KeyE" && canSwitch && !gameOver && !gameClear && !gameComplete) {
    dimension = dimension === "normal" ? "alt" : "normal";
    canSwitch = false;
    setTimeout(() => canSwitch = true, 300);
  }
  if (e.code === "KeyR" && gameOver) loadLevel(currentLevel);
  if (e.code === "KeyR" && gameComplete) {
    currentLevel = 0;
    gameComplete = false;
    loadLevel(0);
  }
});
document.addEventListener("keyup", (e) => keys[e.code] = false);

// ===== ปุ่มมือถือบน Canvas =====
const touchBtns = {
  left:  { x: 0, y: 0, w: 80, h: 80 },
  right: { x: 0, y: 0, w: 80, h: 80 },
  jump:  { x: 0, y: 0, w: 80, h: 80 },
  dim:   { x: 0, y: 0, w: 80, h: 80 },
};

function updateTouchBtnPositions() {
  const b = 20;
  touchBtns.left.x  = 20;
  touchBtns.left.y  = canvas.height - 80 - b;
  touchBtns.right.x = 120;
  touchBtns.right.y = canvas.height - 80 - b;
  touchBtns.jump.x  = canvas.width - 120;
  touchBtns.jump.y  = canvas.height - 80 - b;
  touchBtns.dim.x   = canvas.width - 220;
  touchBtns.dim.y   = canvas.height - 80 - b;
}

function drawTouchButtons() {
  if (window.innerWidth > 800) return;
  updateTouchBtnPositions();
  const btns = [
    { ...touchBtns.left,  label: "◀" },
    { ...touchBtns.right, label: "▶" },
    { ...touchBtns.jump,  label: "▲" },
    { ...touchBtns.dim,   label: "E" },
  ];
  for (const btn of btns) {
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.beginPath();
    ctx.roundRect(btn.x, btn.y, btn.w, btn.h, 40);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 28px Arial";
    ctx.textAlign = "center";
    ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + btn.h / 2 + 10);
    ctx.textAlign = "left";
  }
}

function isTouchInBtn(tx, ty, btn) {
  return tx >= btn.x && tx <= btn.x + btn.w &&
         ty >= btn.y && ty <= btn.y + btn.h;
}

canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  updateTouchBtnPositions();
  for (const touch of e.changedTouches) {
    const tx = touch.clientX;
    const ty = touch.clientY;
    if (isTouchInBtn(tx, ty, touchBtns.left))  keys["ArrowLeft"]  = true;
    if (isTouchInBtn(tx, ty, touchBtns.right)) keys["ArrowRight"] = true;
    if (isTouchInBtn(tx, ty, touchBtns.jump))  keys["Space"]      = true;
    if (isTouchInBtn(tx, ty, touchBtns.dim) && canSwitch && !gameOver && !gameClear && !gameComplete) {
      dimension = dimension === "normal" ? "alt" : "normal";
      canSwitch = false;
      setTimeout(() => canSwitch = true, 300);
    }
  }
}, { passive: false });

canvas.addEventListener("touchend", (e) => {
  e.preventDefault();
  updateTouchBtnPositions();
  for (const touch of e.changedTouches) {
    const tx = touch.clientX;
    const ty = touch.clientY;
    if (isTouchInBtn(tx, ty, touchBtns.left))  keys["ArrowLeft"]  = false;
    if (isTouchInBtn(tx, ty, touchBtns.right)) keys["ArrowRight"] = false;
    if (isTouchInBtn(tx, ty, touchBtns.jump))  keys["Space"]      = false;
  }
}, { passive: false });

// ===== Collision =====
function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// ===== Update =====
function update() {
  if (gameOver || gameClear || gameComplete) return;

  const lvl = levels[currentLevel];
  const world = dimension === "normal" ? lvl.normal : lvl.alt;

  if (keys["ArrowLeft"]  || keys["KeyA"]) oppy.velX = -oppy.speed;
  else if (keys["ArrowRight"] || keys["KeyD"]) oppy.velX = oppy.speed;
  else oppy.velX = 0;

  if ((keys["ArrowUp"] || keys["KeyW"] || keys["Space"]) && oppy.onGround) {
    oppy.velY = oppy.jumpForce;
    oppy.onGround = false;
  }

  oppy.velY += GRAVITY;
  oppy.x += oppy.velX;
  oppy.y += oppy.velY;

  if (oppy.y + oppy.height >= GROUND_Y) {
    gameOver = true;
    return;
  }

  oppy.onGround = false;
  for (const p of world.platforms) {
    if (isColliding(oppy, p)) {
      const prevBottom = oppy.y + oppy.height - oppy.velY;
      if (oppy.velY > 0 && prevBottom <= p.y + 5) {
        oppy.y = p.y - oppy.height;
        oppy.velY = 0;
        oppy.onGround = true;
      } else if (oppy.velY < 0) {
        oppy.y = p.y + p.height;
        oppy.velY = 0;
      }
    }
  }

  if (oppy.x < 0) oppy.x = 0;

  const targetCam = oppy.x - canvas.width / 3;
  cameraX = Math.max(0, Math.min(targetCam, MAP_WIDTH - canvas.width));

  if (dimension === lvl.goalDimension && isColliding(oppy, lvl.goal)) {
    gameClear = true;
  }
}

// ===== Draw =====
function drawBackground() {
  const world = dimension === "normal"
    ? levels[currentLevel].normal
    : levels[currentLevel].alt;
  ctx.fillStyle = world.bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawLava() {
  ctx.fillStyle = "#ff4500";
  ctx.fillRect(-cameraX, GROUND_Y, MAP_WIDTH, canvas.height - GROUND_Y);
  ctx.fillStyle = "#ff6a00";
  for (let i = 0; i < MAP_WIDTH; i += 40) {
    ctx.beginPath();
    ctx.ellipse(i - cameraX + 20, GROUND_Y, 20, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawPlatforms() {
  const lvl = levels[currentLevel];
  const world = dimension === "normal" ? lvl.normal : lvl.alt;
  ctx.fillStyle = world.platformColor;
  for (const p of world.platforms) {
    ctx.fillRect(p.x - cameraX, p.y, p.width, p.height);
  }
}

function drawGoal() {
  const lvl = levels[currentLevel];
  if (dimension === lvl.goalDimension) {
    const g = lvl.goal;
    ctx.fillStyle = "#FFD700";
    ctx.fillRect(g.x - cameraX, g.y, g.width, g.height);
    ctx.font = "20px Arial";
    ctx.fillText("🏁", g.x - cameraX, g.y - 5);
  }
}

function drawOppy() {
  const screenX = oppy.x - cameraX;
  if (dimension === "alt") {
    ctx.shadowColor = "#9b30ff";
    ctx.shadowBlur = 15;
  }
  ctx.fillStyle = "#f5c518";
  ctx.beginPath();
  ctx.ellipse(
    screenX + oppy.width / 2,
    oppy.y + oppy.height / 2,
    oppy.width / 2, oppy.height / 2,
    0, 0, Math.PI * 2
  );
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.arc(screenX + 14, oppy.y + 18, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(screenX + 26, oppy.y + 18, 5, 0, Math.PI * 2);
  ctx.fill();
}

function drawHUD() {
  const progress = oppy.x / MAP_WIDTH;
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.fillRect(10, 35, canvas.width - 20, 8);
  ctx.fillStyle = dimension === "normal" ? "#4a9e4a" : "#9b30ff";
  ctx.fillRect(10, 35, (canvas.width - 20) * progress, 8);

  ctx.fillStyle = dimension === "normal" ? "#4a9e4a" : "#9b30ff";
  ctx.font = "bold 16px Arial";
  ctx.fillText(
    dimension === "normal" ? "🌍 โลกปกติ  [E] สลับมิติ" : "🌀 โลกมิติ  [E] กลับ",
    10, 25
  );

  const lvl = levels[currentLevel];
  ctx.fillStyle = lvl.goalDimension === "normal" ? "#4a9e4a" : "#9b30ff";
  ctx.font = "14px Arial";
  ctx.textAlign = "center";
  ctx.fillText(
    lvl.goalDimension === "normal" ? "🏁 เส้นชัย: โลกปกติ" : "🏁 เส้นชัย: โลกมิติ",
    canvas.width / 2, 25
  );
  ctx.textAlign = "left";

  ctx.fillStyle = "#fff";
  ctx.font = "bold 16px Arial";
  ctx.textAlign = "right";
  ctx.fillText(`Level ${currentLevel + 1} / ${levels.length}`, canvas.width - 10, 25);
  ctx.textAlign = "left";
}

function drawUI() {
  if (gameClear) {
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 52px Arial";
    ctx.textAlign = "center";
    ctx.fillText("🎉 CLEAR!", canvas.width / 2, 200);
    ctx.textAlign = "left";
    drawButton(btnNextLevel, "#4CAF50", "▶ Next Level");
    drawButton(btnRestart,   "#e53935", "↺ เริ่มใหม่");
  }
  if (gameOver) {
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ff4444";
    ctx.font = "bold 52px Arial";
    ctx.textAlign = "center";
    ctx.fillText("💀 GAME OVER", canvas.width / 2, 200);
    ctx.textAlign = "left";
    drawButton(btnRestartOnly, "#e53935", "↺ เล่นด่านนี้ใหม่");
  }
  if (gameComplete) {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 42px Arial";
    ctx.textAlign = "center";
    ctx.fillText("🏆 ผ่านทุก Level แล้ว!", canvas.width / 2, 190);
    ctx.textAlign = "left";
    drawButton(btnRestartOnly, "#4CAF50", "↺ เล่นใหม่ตั้งแต่ต้น");
  }
}

// ===== Game Loop =====
function gameLoop() {
  drawBackground();
  drawLava();
  drawPlatforms();
  drawGoal();
  drawOppy();
  drawHUD();
  drawTouchButtons();
  drawUI();
  update();
  requestAnimationFrame(gameLoop);
}

loadLevel(0);
gameLoop();