let allData = [];
let remaining = [];
let currentAnswer = null;
let score = 0;
let total = 0;
let currentMode = "";

// ================= SCREENS =================
const home = document.getElementById("home-screen");
const mode = document.getElementById("mode-screen");
const game = document.getElementById("game-screen");
const end = document.getElementById("end-screen");

// ================= ELEMENTS =================
const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const scoreText = document.getElementById("score-text");
const progressEl = document.getElementById("progress");

// ================= BUTTONS =================
const infoBtn = document.getElementById("info-btn");
const restartBtn = document.getElementById("restart-btn");

// ================= NAVIGATION =================
document.getElementById("start-btn").onclick = () => show(mode);
document.getElementById("back-btn").onclick = () => show(home);
document.getElementById("home-btn").onclick = () => show(home);

// home button during game
document.getElementById("home-game-btn").onclick = () => {
    resetGame();
    show(home);
};

// restart
if (restartBtn) {
    restartBtn.onclick = () => {
        if (currentMode) startByMode(currentMode);
    };
}

// info
if (infoBtn) {
    infoBtn.onclick = () => {
        // ส่งหมวดไปให้ info.html
        window.location.href = `info.html?category=${currentMode}`;
    };
}

// ================= MODE BUTTONS =================
document.getElementById("mode-country").onclick = () => startByMode("country");
document.getElementById("mode-food").onclick = () => startByMode("food");
document.getElementById("mode-object").onclick = () => startByMode("object");
document.getElementById("mode-quiz").onclick = () => startByMode("quiz");
document.getElementById("mode-history").onclick = () => startByMode("history");

// ================= CORE =================
function show(screen) {
    [home, mode, game, end].forEach(s => s.classList.remove("active"));
    screen.classList.add("active");
}

function startByMode(modeName) {
    currentMode = modeName;
    localStorage.setItem("mode", modeName);

    let data = [];
    if (modeName === "country") data = countryData;
    if (modeName === "food") data = foodData;
    if (modeName === "object") data = objectData;
    if (modeName === "quiz") data = quizData;
    if (modeName === "history") data = historyData;

    start(data);
}

function start(data) {
    allData = [...data];
    remaining = shuffle([...data]);
    total = allData.length;
    score = 0;

    // 🔴 สำคัญมาก: ซ่อน Info ทุกครั้งที่เริ่มเกม
    if (infoBtn) infoBtn.style.display = "none";

    show(game);
    nextQuestion();
}

function nextQuestion() {
    if (remaining.length === 0) {
        scoreText.textContent = `Your Score: ${score} / ${total}`;

        // ✅ แสดง Info เฉพาะบางหมวดเท่านั้น
        if (infoBtn) {
            const allowInfo = ["country", "food", "history"];
            infoBtn.style.display = allowInfo.includes(currentMode)
                ? "inline-block"
                : "none";
        }

        show(end);
        return;
    }

    choicesEl.innerHTML = "";

    const currentIndex = total - remaining.length + 1;
    progressEl.textContent = `${currentIndex} / ${total}`;

    currentAnswer = remaining.shift();

    let options = [
        currentAnswer,
        ...shuffle(
            allData.filter(i =>
                (i.name || i.answer) !== (currentAnswer.name || currentAnswer.answer)
            )
        ).slice(0, 3)
    ];

    options = shuffle(options);

    questionEl.textContent =
        currentAnswer.question ||
        currentAnswer.name ||
        currentAnswer.answer;

    options.forEach(opt => {
        const img = document.createElement("img");
        img.src = opt.flag || opt.image;
        img.alt = opt.name || opt.answer;

        img.onclick = () => handleAnswer(img, opt);
        choicesEl.appendChild(img);
    });
}

function handleAnswer(img, selected) {
    const imgs = document.querySelectorAll("#choices img");
    imgs.forEach(i => i.style.pointerEvents = "none");

    const correct = currentAnswer.name || currentAnswer.answer;

    if ((selected.name || selected.answer) === correct) {
        img.classList.add("correct");
        score++;
    } else {
        img.classList.add("wrong");
        imgs.forEach(i => {
            if (i.alt === correct) {
                i.classList.add("correct");
            }
        });
    }

    setTimeout(nextQuestion, 900);
}

function resetGame() {
    allData = [];
    remaining = [];
    currentAnswer = null;
    score = 0;
    total = 0;
    currentMode = "";

    questionEl.textContent = "";
    choicesEl.innerHTML = "";
    progressEl.textContent = "";

    if (infoBtn) infoBtn.style.display = "none";
}

// ================= UTILS =================
function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

// ================= START =================
show(home);
