const params = new URLSearchParams(window.location.search);
const category = params.get("category") || "country";

const container = document.getElementById("info-container");
const title = document.querySelector(".page-title");

container.innerHTML = "";

// เปลี่ยนหัวข้อ
if (category === "country") title.textContent = "Country Information";
if (category === "food") title.textContent = "Food Information";
if (category === "history") title.textContent = "History Information";

// เลือกแสดงข้อมูล
if (category === "country") renderCountry();
if (category === "food") renderFood();
if (category === "history") renderHistory();

function renderCountry() {
    countryData.forEach(c => {
        container.innerHTML += `
        <div class="card">
            <img src="${c.flag}">
            <h2>${c.name}</h2>
            <p>เมืองหลวง: ${c.capital}</p>
            <p>อาหารประจำชาติ: ${c.food}</p>
            <p>สัตว์ประจำชาติ: ${c.animal}</p>
            <p>ดอกไม้ประจำชาติ: ${c.flower}</p>
        </div>`;
    });
}

function renderFood() {
    foodData.forEach(f => {
        container.innerHTML += `
        <div class="card">
            <img src="${f.image}">
            <h2>${f.name}</h2>
            <p>ประเทศ: ${f.country}</p>
            <p>${f.description}</p>
        </div>`;
    });
}

function renderHistory() {
    historyData.forEach(h => {
        container.innerHTML += `
        <div class="card">
            <img src="${h.image}">
            <h2>${h.title}</h2>
            <p>${h.detail}</p>
        </div>`;
    });
}

function goBack() {
    window.location.href = "index.html";
}
