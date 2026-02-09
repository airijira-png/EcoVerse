/* ===== State ===== */
let doorClosed = false;
let energyFilled = false;
let autoMode = false;
let planet = "";

let energy = 100;
let energyTimer = null;

let shipX = 80;
let asteroidY = -40;
let dodged = 0;
let driving = false;

let quizCorrect = 0;

/* ===== Elements ===== */
const startBtn = document.getElementById("startBtn"); // ⭐ เพิ่มแค่นี้
const statusBar = document.getElementById("status");
const energyFill = document.getElementById("energyFill");
const message = document.getElementById("message");
const ship = document.getElementById("ship");
const asteroid = document.getElementById("asteroid");

/* ===== Home -> Prepare ===== */
startBtn.onclick = () => show("prepare");


/* ===== Screen Control ===== */
function show(id) {
  document.querySelectorAll(
    "#home,#prepare,#energyGame,#danger,#drive,#quiz,#finish"
  ).forEach(e => e.classList.add("hidden"));

  document.getElementById(id).classList.remove("hidden");

  // 🔋 พลังงานแสดงเฉพาะช่วงเล่นจริง
  if (["drive", "quiz"].includes(id)) {
    statusBar.classList.remove("hidden");
  } else {
    statusBar.classList.add("hidden");
  }
}

/* ===== Home -> Prepare ===== */
startBtn.onclick = () => show("prepare");

/* ===== Prepare Logic ===== */
doorBtn.onclick = () => {
  doorClosed = true;
  message.textContent = "✅ ปิดประตูเรียบร้อย";
};

energyBtn.onclick = () => {
  if (!doorClosed) {
    message.textContent = "❗ กรุณาปิดประตูก่อนเติมพลังงาน";
    return;
  }
  show("energyGame");
  newMath();
};

autoBtn.onclick = () => {
  if (!energyFilled) {
    message.textContent = "❗ เติมพลังงานก่อนเปิดโหมดออโต้";
    return;
  }
  autoMode = true;
  message.textContent = "🤖 เปิดโหมดออโต้แล้ว";
};

planetSelect.onchange = e => planet = e.target.value;

launchBtn.onclick = () => {
  if (!doorClosed) return message.textContent = "❗ ยังไม่ได้ปิดประตู";
  if (!energyFilled) return message.textContent = "❗ เติมพลังงานก่อน";
  if (!planet) return message.textContent = "❗ เลือกดาวปลายทาง";
  show("danger");
};

/* ===== Energy Mini Game ===== */
let correctAnswer = 0;

function newMath() {
  const a = Math.floor(Math.random() * 5) + 1;
  const b = Math.floor(Math.random() * 5) + 1;
  correctAnswer = a + b;
  mathQ.textContent = `🧮 ${a} + ${b} = ?`;
}

mathSubmit.onclick = () => {
  if (+mathA.value === correctAnswer) {
    energyFilled = true;
    show("prepare");
    message.textContent = "🔋 เติมพลังงานสำเร็จ";
  } else {
    alert("ลองใหม่อีกครั้ง");
  }
};

/* ===== Energy Drain ===== */
function startEnergyDrain() {
  stopEnergyDrain();
  energy = 100;
  updateEnergy();
  energyTimer = setInterval(() => {
    energy--;
    updateEnergy();
    if (energy <= 0) {
      alert("พลังงานหมด!");
      location.reload();
    }
  }, 500);
}

function stopEnergyDrain() {
  if (energyTimer) clearInterval(energyTimer);
}

function updateEnergy() {
  energyFill.style.width = energy + "%";
  energyFill.style.background = energy < 30 ? "red" : "lime";
}

/* ===== Danger Choices ===== */
driveBtn.onclick = () => {
  show("drive");
  resetDrive();
  startEnergyDrain();
  driving = true;
  requestAnimationFrame(moveAsteroid);
};

quizBtn.onclick = () => {
  show("quiz");
  startEnergyDrain();
  nextQuestion();
};

/* ===== Drive Mode ===== */
document.addEventListener("keydown", e => {
  if (!driving) return;
  if (e.key === "ArrowLeft" && shipX > 0) shipX -= 40;
  if (e.key === "ArrowRight" && shipX < 160) shipX += 40;
  ship.style.left = shipX + "px";
});

function resetDrive() {
  shipX = 80;
  asteroidY = -40;
  dodged = 0;
  ship.style.left = shipX + "px";
  document.getElementById("dodged").textContent = dodged;
}

function moveAsteroid() {
  if (!driving) return;

  asteroidY += 5;
  asteroid.style.top = asteroidY + "px";

  if (asteroidY > 300) {
    dodged++;
    document.getElementById("dodged").textContent = dodged;
    resetAsteroid();
  }

  if (asteroidY > 240 && shipX === asteroid.offsetLeft) {
    energy -= 15;
    updateEnergy();
    resetAsteroid();
  }

  if (dodged >= 20) return finishGame();
  requestAnimationFrame(moveAsteroid);
}

function resetAsteroid() {
  asteroidY = -40;
  asteroid.style.top = asteroidY + "px";
  asteroid.style.left = [0, 80, 160][Math.floor(Math.random() * 3)] + "px";
}

/* ===== Quiz Mode ===== */
const questions = [
  {
    q: "โลกเป็นดาวประเภทใด?",
    c: ["ดาวเคราะห์", "ดาวฤกษ์", "ดาวหาง"],
    a: 0
  },
  {
    q: "ดวงอาทิตย์ให้สิ่งใดกับโลก?",
    c: ["แสงและความร้อน", "น้ำ", "อากาศ"],
    a: 0
  },
  {
    q: "ดาวดวงใดเป็นบริวารของโลก?",
    c: ["ดาวอังคาร", "ดวงจันทร์", "ดาวศุกร์"],
    a: 1
  },
  {
    q: "นักบินอวกาศใช้สิ่งใดหายใจในอวกาศ?",
    c: ["หมวกอวกาศ", "อากาศจากโลก", "ต้นไม้"],
    a: 0
  },
  {
    q: "อวกาศมีอากาศให้หายใจหรือไม่?",
    c: ["มี", "ไม่มี", "มีเฉพาะกลางวัน"],
    a: 1
  },
  {
    q: "ดาวอังคารมีสีอะไร?",
    c: ["สีเขียว", "สีแดง", "สีน้ำเงิน"],
    a: 1
  },
  {
    q: "โลกหมุนรอบสิ่งใด?",
    c: ["ดวงอาทิตย์", "ดวงจันทร์", "ดาวพฤหัสบดี"],
    a: 0
  },
  {
    q: "กลางวันเกิดจากอะไร?",
    c: ["โลกหมุนเข้าหาดวงอาทิตย์", "ดวงอาทิตย์ดับ", "โลกหยุดหมุน"],
    a: 0
  },
  {
    q: "ดาวฤกษ์ให้แสงเองได้หรือไม่?",
    c: ["ได้", "ไม่ได้", "ได้เฉพาะกลางคืน"],
    a: 0
  },
  {
    q: "ยานอวกาศใช้สิ่งใดเดินทาง?",
    c: ["พลังงาน", "ลม", "น้ำ"],
    a: 0
  }
];

function nextQuestion() {
  if (quizCorrect >= 5) return finishGame();

  const q = questions[quizCorrect];
  quizQ.textContent = q.q;
  quizChoices.innerHTML = "";

  q.c.forEach((choice, i) => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => {
      if (i === q.a) quizCorrect++;
      document.getElementById("quizCount").textContent = quizCorrect;
      nextQuestion();
    };
    quizChoices.appendChild(btn);
  });
}

/* ===== Finish ===== */
function finishGame() {
  driving = false;
  stopEnergyDrain();
  show("finish");
}
