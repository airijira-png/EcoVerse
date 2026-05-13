// ===== Canvas Setup =====
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const GRAVITY = 0.5;
const GROUND_Y = 350;
const MAP_WIDTH = 2400;

// ===== Screen State =====
let screen = "menu"; // "menu", "levelSelect", "playing"

const levels = [
  {
    goalDimension: "alt",
    normal: {
      platforms: [
        { x: 60,   y: 310, width: 80,  height: 15 },
        { x: 280,  y: 290, width: 70,  height: 15 },
        { x: 700,  y: 280, width: 70,  height: 15 },
        { x: 1100, y: 270, width: 70,  height: 15 },
        { x: 1550, y: 260, width: 70,  height: 15 },
        { x: 1980, y: 250, width: 70,  height: 15 },
        { x: 2200, y: 240, width: 70,  height: 15 },
      ],
      bgColor: "#16213e", platformColor: "#8B4513",
    },
    alt: {
      platforms: [
        { x: 430,  y: 270, width: 60,  height: 15 },
        { x: 560,  y: 250, width: 60,  height: 15 },
        { x: 860,  y: 240, width: 60,  height: 15 },
        { x: 990,  y: 220, width: 60,  height: 15 },
        { x: 1310, y: 220, width: 60,  height: 15 },
        { x: 1440, y: 200, width: 60,  height: 15 },
        { x: 1760, y: 200, width: 60,  height: 15 },
        { x: 1880, y: 180, width: 60,  height: 15 },
        { x: 2320, y: 160, width: 60,  height: 15 },
      ],
      bgColor: "#1a0a2e", platformColor: "#9b30ff",
    },
    goal: { x: 2340, y: 110, width: 35, height: 55 },
    startX: 80, startY: 250,
  },
  {
    goalDimension: "normal",
    normal: {
      platforms: [
        { x: 60,   y: 300, width: 90,  height: 15 },
        { x: 550,  y: 280, width: 70,  height: 15 },
        { x: 1400, y: 310, width: 70,  height: 15 },
        { x: 650,  y: 200, width: 100, height: 15 },
        { x: 1800, y: 150, width: 80,  height: 15 },
      ],
      bgColor: "#0d1b2a", platformColor: "#6B3410",
    },
    alt: {
      platforms: [
        { x: 200,  y: 310, width: 60,  height: 15 },
        { x: 800,  y: 290, width: 60,  height: 15 },
        { x: 1600, y: 300, width: 60,  height: 15 },
        { x: 350,  y: 230, width: 60,  height: 15 },
        { x: 950,  y: 240, width: 100, height: 15 },
        { x: 500,  y: 160, width: 60,  height: 15 },
        { x: 1100, y: 130, width: 60,  height: 15 },
      ],
      bgColor: "#12002e", platformColor: "#7700cc",
    },
    goal: { x: 1820, y: 95, width: 35, height: 55 },
    startX: 80, startY: 250,
  },
  {
    goalDimension: "alt",
    normal: {
      platforms: [
        { x: 60,   y: 300, width: 90,  height: 15 },
        { x: 550,  y: 270, width: 120, height: 15 },
        { x: 950,  y: 240, width: 80,  height: 15 },
        { x: 380,  y: 210, width: 80,  height: 15 },
        { x: 1470, y: 200, width: 80,  height: 15 },
      ],
      spikes: [
        { x: 590, y: 255, width: 40, height: 15 },
      ],
      bgColor: "#1a0000", platformColor: "#5a2800",
    },
    alt: {
      platforms: [
        { x: 200,  y: 300, width: 65,  height: 15 },
        { x: 390,  y: 285, width: 65,  height: 15 },
        { x: 820,  y: 270, width: 65,  height: 15 },
        { x: 160,  y: 220, width: 65,  height: 15 },
        { x: 1150, y: 210, width: 65,  height: 15 },
        { x: 600,  y: 170, width: 100, height: 15 },
        { x: 1000, y: 140, width: 100,  height: 15 },
        { x: 1700, y: 140, width: 65,  height: 15 },
      ],
      spikes: [
        { x: 630, y: 155, width: 40, height: 15 },
      ],
      bgColor: "#0a0015", platformColor: "#5500aa",
    },
    goal: { x: 1720, y: 90, width: 35, height: 55 },
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
  canvas.height = 500;
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
  screen = "playing";
}

// ===== ปุ่ม UI =====
function getBtnNextLevel()   { return { x: canvas.width/2-160, y: 230, width: 150, height: 45 }; }
function getBtnRestart()     { return { x: canvas.width/2+10,  y: 230, width: 150, height: 45 }; }
function getBtnRestartOnly() { return { x: canvas.width/2-80,  y: 230, width: 160, height: 45 }; }

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

// ===== Menu Buttons =====
function getMenuBtns() {
  const cx = canvas.width / 2;
  return {
    start: { x: cx - 100, y: 220, width: 200, height: 55 },
    level: { x: cx - 100, y: 295, width: 200, height: 55 },
  };
}

function getLevelBtns() {
  const cx = canvas.width / 2;
  return [
    { x: cx - 180, y: 230, width: 100, height: 100, label: "1" },
    { x: cx - 50,  y: 230, width: 100, height: 100, label: "2" },
    { x: cx + 80,  y: 230, width: 100, height: 100, label: "3" },
  ];
}

// ===== Draw Menu =====
function drawMenu() {
  // พื้นหลัง
  ctx.fillStyle = "#0f0f1e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // ดาว
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  for (let i = 0; i < 80; i++) {
    const sx = (i * 137 + 50) % canvas.width;
    const sy = (i * 97 + 30) % (canvas.height * 0.7);
    ctx.beginPath();
    ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // ชื่อเกม
  ctx.shadowColor = "#9b30ff";
  ctx.shadowBlur = 20;
  ctx.fillStyle = "#f5c518";
  ctx.font = "bold 64px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Oppy Game", canvas.width / 2, 140);
  ctx.shadowBlur = 0;

  // Oppy
  ctx.fillStyle = "#f5c518";
  ctx.beginPath();
  ctx.ellipse(canvas.width/2, 185, 25, 30, 0, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.arc(canvas.width/2 - 8, 180, 5, 0, Math.PI*2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(canvas.width/2 + 8, 180, 5, 0, Math.PI*2);
  ctx.fill();

  // ปุ่ม
  const btns = getMenuBtns();
  drawButton(btns.start, "#4CAF50", "▶  START");
  drawButton(btns.level, "#7700cc", "🎮  LEVEL SELECT");

  ctx.textAlign = "left";
}

// ===== Draw Level Select =====
function drawLevelSelect() {
  ctx.fillStyle = "#0f0f1e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#fff";
  ctx.font = "bold 40px Arial";
  ctx.textAlign = "center";
  ctx.fillText("เลือก Level", canvas.width / 2, 160);

  const btns = getLevelBtns();
  const colors = ["#4CAF50", "#2196F3", "#e53935"];
  for (let i = 0; i < btns.length; i++) {
    const b = btns[i];
    ctx.fillStyle = colors[i];
    ctx.beginPath();
    ctx.roundRect(b.x, b.y, b.width, b.height, 15);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 48px Arial";
    ctx.textAlign = "center";
    ctx.fillText(b.label, b.x + b.width/2, b.y + b.height/2 + 16);
  }

  // ปุ่มกลับ
  const backBtn = { x: canvas.width/2 - 70, y: 370, width: 140, height: 45 };
  drawButton(backBtn, "#555", "◀ กลับ");
  ctx.textAlign = "left";
}

// ===== Click Handler =====
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  if (screen === "menu") {
    const btns = getMenuBtns();
    if (isClickInBtn(mx, my, btns.start)) {
      currentLevel = 0;
      loadLevel(0);
    }
    if (isClickInBtn(mx, my, btns.level)) {
      screen = "levelSelect";
    }
  }

  else if (screen === "levelSelect") {
    const btns = getLevelBtns();
    for (let i = 0; i < btns.length; i++) {
      if (isClickInBtn(mx, my, btns[i])) {
        currentLevel = i;
        loadLevel(i);
      }
    }
    const backBtn = { x: canvas.width/2 - 70, y: 370, width: 140, height: 45 };
    if (isClickInBtn(mx, my, backBtn)) screen = "menu";
  }

  else if (screen === "playing") {
    const btnNextLevel   = getBtnNextLevel();
    const btnRestart     = getBtnRestart();
    const btnRestartOnly = getBtnRestartOnly();

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
        screen = "menu";
      }
    }
  }
});

// ===== Input คีย์บอร์ด =====
const keys = {};
document.addEventListener("keydown", (e) => {
  keys[e.code] = true;
  if (screen !== "playing") return;
  if (e.code === "KeyE" && canSwitch && !gameOver && !gameClear && !gameComplete) {
    dimension = dimension === "normal" ? "alt" : "normal";
    canSwitch = false;
    setTimeout(() => canSwitch = true, 300);
  }
  if (e.code === "KeyR" && gameOver) loadLevel(currentLevel);
  if (e.code === "Escape") screen = "menu";
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
    if (screen !== "playing") return;
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
  if (screen !== "playing") return;
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

  const spikes = (dimension === "normal" ? lvl.normal : lvl.alt).spikes;
  if (spikes) {
    for (const s of spikes) {
      if (isColliding(oppy, s)) {
        gameOver = true;
        return;
      }
    }
  }

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

function drawSpikes() {
  const lvl = levels[currentLevel];
  const world = dimension === "normal" ? lvl.normal : lvl.alt;
  if (!world.spikes) return;
  ctx.fillStyle = "#ff4444";
  for (const s of world.spikes) {
    ctx.beginPath();
    ctx.moveTo(s.x - cameraX, s.y + s.height);
    ctx.lineTo(s.x - cameraX + s.width / 2, s.y);
    ctx.lineTo(s.x - cameraX + s.width, s.y + s.height);
    ctx.closePath();
    ctx.fill();
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
  const btnNextLevel   = getBtnNextLevel();
  const btnRestart     = getBtnRestart();
  const btnRestartOnly = getBtnRestartOnly();

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
    drawButton(btnRestartOnly, "#4CAF50", "↺ กลับหน้าเมนู");
  }
}

// ===== Game Loop =====
function gameLoop() {
  if (screen === "menu") {
    drawMenu();
  } else if (screen === "levelSelect") {
    drawLevelSelect();
  } else {
    drawBackground();
    drawLava();
    drawPlatforms();
    drawSpikes();
    drawGoal();
    drawOppy();
    drawHUD();
    drawTouchButtons();
    drawUI();
  }
  update();
  requestAnimationFrame(gameLoop);
}

gameLoop();