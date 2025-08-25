// JS
import { Userdata, GetDataViaAPI } from "./quizV1.js";

const name = document.getElementById("GetName");
const topiVal = document.getElementById("topic");
const levelVal = document.getElementById("difficulty");
const QsNumber = document.getElementById("NumOfQA");
const suggestionModal = document.getElementById("modal-sugg");

function setUserInfo() {
    try {
        let data = JSON.parse(localStorage.getItem("usersName"));
        return new Userdata(data.name, data.major, data.quizTopic, data.difficulty, data.NumofQs);
    } catch (err) {
        console.log(`problem catched :${err} , unfortunatelly we can't get the user yet `)
    }
}

let colorClasses = {
    hard: ["bg-red-500", "border-red-500"],
    medium: ["bg-yellow-500", "border-yellow-500"],
    easy: ["bg-green-400", "border-green-400"]
};
const Sel = document.getElementById("Topic");
const OurUser = setUserInfo();
const levels = ["hard", "medium", "easy"];
const nums = [3, 5, 10, 15, 20];
const selectDataMap = {
    diff: levels,
    NumofQes: nums
};

function UpdateDom() {
    name.textContent = OurUser?.name;
    topiVal.textContent = OurUser?.quizTopic;
    levelVal.textContent = OurUser?.difficulty;
    QsNumber.textContent = OurUser?.NumofQs;
    document.getElementById("majorOfuser").textContent = OurUser?.major;

    // Remove any previous color classes first
    Object.values(colorClasses).flat().forEach(c => {
        levelVal.parentElement.parentElement.classList.remove(c);
    });

    // Add the correct color class
    levelVal.parentElement.parentElement.classList.add(...(colorClasses[levelVal.textContent] || []));
    GetRestData();
    if (!OurUser?.CheckMajorIsCs()) {
        if (!localStorage.getItem("suggestionShowsn")) {
            let ShowSugg = setTimeout(() => {
                suggestionModal.classList.remove("hidden");
                document.querySelector(".Hide").addEventListener("click", () => {
                    clearTimeout(ShowSugg);
                    suggestionModal.classList.add("hidden");
                });
                localStorage.setItem("suggestionShowsn", "true");
            }, 2000);
        }
    }
}

document.querySelectorAll("select").forEach((sel) => {
    sel.addEventListener("change", () => {
        OurUser.setData({ [sel.id]: sel.value });
        UpdateDom();

    });
});

UpdateDom();
// GetDataViaAPI(Sel, document.getElementById("QuizzCon"));
function GetRestData() {
    Object.entries(selectDataMap).forEach(([id, values]) => {
        const sel = document.getElementById(id);
        values.forEach(item => {
            if (![...sel.options].some(opt => opt.value == item)) {
                sel.add(new Option(item, item));
            }
        });
    });
}

/* ---------------- TIMER CODE ---------------- */

const TimerSettModal = document.getElementById("Timersett");
const TimerWr = document.getElementById("timer");
const Minutes = document.getElementById("GetMins");
const Seconds = document.getElementById("GetSecs");
const TimerC = document.getElementById("time");

function timerSEttings() {
    document.querySelectorAll("input").forEach(element => {
        element.addEventListener("input", () => {
            if (element.value.length > 2) {
                element.value = element.value.slice(0, 2);
            }
            if (element.dataset.min === "secs") {
                if (parseInt(element.value) > 59) {
                    element.value = "00";
                }
            }
        });
    });
}

TimerWr.addEventListener("click", () => {
    TimerSettModal.classList.remove("hidden");
    timerSEttings();
});

document.addEventListener("click", (event) => {
    if (!document.getElementById("containerTimer").contains(event.target) && event.target !== TimerWr) {
        TimerSettModal.classList.add("hidden");
    }
});

// Timer class
class Timer {
    constructor(minutes, seconds, time) {
        this.minInt = 0;
        this.secInt = 0;
        this.timerV = null;
        this.isPaused = false;
        this.displayTime = time;
        this.minInput = minutes;
        this.secInput = seconds;
        this.ClockEndaudio = new Audio("/Quizapp/public/mixkit-clock-bells-hour-signal-1069.wav");
    }

    updateDisplay() {
        this.displayTime.textContent = `${String(this.minInt).padStart(2, '0')}:${String(this.secInt).padStart(2, '0')}`;
        this.minInput.value = `${String(this.minInt).padStart(2, '0')}`;
        this.secInput.value = `${String(this.secInt).padStart(2, '0')}`;
    }

    ticking() {
        if (this.isPaused) return;

        if (this.minInt === 0 && this.secInt === 0) {
            this.stop();
            this.ClockEndaudio.play();
            return;
        }

        if (this.secInt === 0) {
            this.secInt = 59;
            this.minInt -= 1;
        } else {
            this.secInt -= 1;
        }

        this.updateDisplay();
        this.timerV = setTimeout(() => { this.ticking(); }, 1000);
    }

    start() {
        this.minInt = parseInt(this.minInput.value) || 0;
        this.secInt = parseInt(this.secInput.value) || 0;
        this.isPaused = false;
        this.updateDisplay();
        this.ticking();
    }

    pause() {
        this.isPaused = true;
        clearTimeout(this.timerV);
        this.timerV = null;
    }

    resume() {
        if (this.isPaused) {
            this.isPaused = false;
            this.ticking();
        }
    }

    reset() {
        this.stop();
        this.minInt = 0;
        this.secInt = 0;
        this.updateDisplay();
    }

    stop() {
        clearTimeout(this.timerV);
        this.timerV = null;
    }

    SaveToLocal() {
        localStorage.setItem("TimerData", JSON.stringify({
            minutes: this.minInt,
            seconds: this.secInt
        }));
    }
}

let clock = new Timer(Minutes, Seconds, TimerC);

document.getElementById("resetTimer").addEventListener("click", () => {
    clock.reset();
});

document.getElementById("PoseTimer").addEventListener("click", () => {
    clock.pause();
});

document.getElementById("startTimer").addEventListener("click", () => {
    if (clock.isPaused) {
        clock.resume();
    } else {
        clock.start();
    }
    TimerSettModal.classList.add("hidden");
});

/* ---------------- QUIZ SECTION  CODE ---------------- */

let ShowRightContent = false;
let currentItem = 0;
async function GetQuestions() {
    try {
        const res = await fetch(`https://quizapi.io/api/v1/questions?apiKey=y65cYlPTKSDaUdayGMs2iiRrJjfEUVHKdDTfHTso&difficulty=${OurUser?.difficulty}&limit=${OurUser?.NumofQs}&tags=${OurUser?.quizTopic}`);
        const data = await res.json();
        return data;
    } catch (err) {
        console.log("no questions yet ");
    }
}
let data = JSON.parse(localStorage.getItem("data"));

function showNextStep() {
    if (currentItem < data.length - 1) {
        currentItem += 1;
    }

}
function showPrevStep() {
    if (currentItem != 0) {
        currentItem -= 1;
    }

}
function escapeHTML(str) {
    return str.replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
}
function ShowSuggestedAnswers(item, ParentEL) {
    const answers = item?.answers;
    Object.entries(answers).forEach(([id, value]) => {
        if (value != null) {
            let li = document.createElement("li");
            li.textContent = value;
            li.id = id;
            li.className = "answer-li";
            ParentEL.appendChild(li);
        }
    })
}
function showCurrentQuestion(current) {
    const item = data.find((cItem, index, array) => index == current);
    document.getElementById("QuizContent").innerHTML = "";
    let div = document.createElement("div");
    div.innerHTML = `
    <h3 class=" text-lg md:text-xl font-semibold first-letter:capitalize  text-blue-600 ">${escapeHTML(item?.question)}</h3>
    <div><ul id="suggestedAnswers" class=" mt-4 md:mt-8 flex flex-col gap-5  md:gap-8 "></ul>
    </div>`
    ShowSuggestedAnswers(item, div.querySelector("#suggestedAnswers"));
    document.getElementById("QuizContent").appendChild(div);
}

document.getElementById("prev").addEventListener("click", () => {
    showPrevStep();
    showCurrentQuestion(currentItem);
})
document.getElementById("next").addEventListener("click", () => {
    showNextStep();
    showCurrentQuestion(currentItem);
})
showCurrentQuestion(currentItem);