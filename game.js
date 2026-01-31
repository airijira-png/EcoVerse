let allData = [];
let remaining = [];
let currentAnswer = null;
let score = 0;
let total = 0;

// screens
const home = document.getElementById("home-screen");
const mode = document.getElementById("mode-screen");
const game = document.getElementById("game-screen");
const end = document.getElementById("end-screen");

// elements
const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const scoreText = document.getElementById("score-text");
const progressEl = document.getElementById("progress");

// navigation
document.getElementById("start-btn").onclick = () => show(mode);
document.getElementById("back-btn").onclick = () => show(home);
document.getElementById("home-btn").onclick = () => show(home);
document.getElementById("restart-btn").onclick = () => start(allData);

// home button during game (FIX)
document.getElementById("home-game-btn").onclick = () => {
    resetGame();
    show(home);
};

// modes
document.getElementById("mode-country").onclick = () => start(countryData);
document.getElementById("mode-food").onclick = () => start(foodData);
document.getElementById("mode-object").onclick = () => start(objectData);
document.getElementById("mode-quiz").onclick = () => start(quizData);
document.getElementById("mode-history").onclick = () => start(historyData);

function show(screen) {
    [home, mode, game, end].forEach(s => s.classList.remove("active"));
    screen.classList.add("active");
}

function start(data) {
    allData = [...data];
    remaining = shuffle([...data]);
    total = allData.length;
    score = 0;
    show(game);
    nextQuestion();
}

function nextQuestion() {
    if (remaining.length === 0) {
        scoreText.textContent = `Your Score: ${score} / ${total}`;
        show(end);
        return;
    }

    choicesEl.innerHTML = "";

    const currentIndex = total - remaining.length + 1;
    progressEl.textContent = `${currentIndex} / ${total}`;

    currentAnswer = remaining.shift();

    let options = [
        currentAnswer,
        ...shuffle(allData.filter(i =>
            (i.name || i.answer) !== (currentAnswer.name || currentAnswer.answer)
        )).slice(0, 3)
    ];

    options = shuffle(options);

    questionEl.textContent =
        currentAnswer.name ||
        currentAnswer.question ||
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
    questionEl.textContent = "";
    choicesEl.innerHTML = "";
    progressEl.textContent = "";
}

function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

show(home);
