let allData = [];
let remaining = [];
let currentAnswer = null;
let score = 0;
let currentIndex = 0;
let locked = false;

// screens
const home = document.getElementById("home-screen");
const mode = document.getElementById("mode-screen");
const game = document.getElementById("game-screen");
const end = document.getElementById("end-screen");

// elements
const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const scoreText = document.getElementById("score-text");
const progressText = document.getElementById("progress-text");

// navigation
document.getElementById("start-btn").onclick = () => show(mode);
document.getElementById("back-btn").onclick = () => show(home);
document.getElementById("home-btn").onclick = () => show(home);
document.getElementById("game-home-btn").onclick = () => show(mode);
document.getElementById("restart-btn").onclick = () => start(allData);

// modes
document.getElementById("mode-country").onclick = () => start(countryData);
document.getElementById("mode-food").onclick = () => start(foodData);
document.getElementById("mode-object").onclick = () => start(objectData);
document.getElementById("mode-quiz").onclick = () => start(quizData);

function show(screen) {
    [home, mode, game, end].forEach(s => s.classList.remove("active"));
    screen.classList.add("active");
}

function start(data) {
    allData = [...data];
    remaining = shuffle([...data]);
    score = 0;
    currentIndex = 0;
    show(game);
    nextQuestion();
}

function nextQuestion() {
    if (remaining.length === 0) {
        scoreText.textContent = `Your Score: ${score} / ${allData.length}`;
        show(end);
        return;
    }

    locked = false;
    choicesEl.innerHTML = "";

    currentIndex++;
    progressText.textContent = `${currentIndex}/${allData.length}`;

    currentAnswer = remaining.shift();
    questionEl.textContent = currentAnswer.name;

    let options = [
        currentAnswer,
        ...shuffle(allData.filter(d => d.name !== currentAnswer.name)).slice(0, 3)
    ];

    options = shuffle(options);

    options.forEach(opt => {
        const img = document.createElement("img");
        img.src = opt.flag;

        img.onclick = () => {
            if (locked) return;
            locked = true;

            if (opt.name === currentAnswer.name) {
                score++;
                img.style.outline = "4px solid #22c55e";
            } else {
                img.style.outline = "4px solid #ef4444";
                [...choicesEl.children].forEach(el => {
                    if (el.src === currentAnswer.flag) {
                        el.style.outline = "4px solid #22c55e";
                    }
                });
            }

            setTimeout(nextQuestion, 800);
        };

        choicesEl.appendChild(img);
    });
}

function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

show(home);
