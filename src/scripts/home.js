// JS
import { Userdata, GetDataViaAPI } from "./quizV1.js";

const name = document.getElementById("GetName");
const topiVal = document.getElementById("topic");
const levelVal = document.getElementById("difficulty");
const QsNumber = document.getElementById("NumOfQA");
const suggestionModal = document.getElementById("modal-sugg");

function setUserInfo() {
    let data = JSON.parse(localStorage.getItem("usersName"));
    return new Userdata(data.name, data.major, data.quizTopic, data.difficulty, data.NumofQs);
}

let colorClasses = {
    hard: ["bg-red-500", "border-red-500"],
    medium: ["bg-yellow-500", "border-yellow-500"],
    easy: ["bg-green-400", "border-green-400"]
};
const Sel = document.getElementById("Topic");
const OurUser = setUserInfo();
const levels = ["hard", "medium", "easy"];
const nums = [5, 10, 15, 20];
const selectDataMap = {
    diff: levels,
    NumofQes: nums
};

function UpdateDom() {
    name.textContent = OurUser.name;
    topiVal.textContent = OurUser.quizTopic;
    levelVal.textContent = OurUser.difficulty;
    QsNumber.textContent = OurUser.NumofQs;
    document.getElementById("majorOfuser").textContent = OurUser.major;

    // Remove any previous color classes first
    Object.values(colorClasses).flat().forEach(c => {
        levelVal.parentElement.parentElement.classList.remove(c);
    });

    // Add the correct color class
    levelVal.parentElement.parentElement.classList.add(...(colorClasses[levelVal.textContent] || []));
    GetRestData();
    if (!OurUser.CheckMajorIsCs()) {
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
GetDataViaAPI(Sel, Sel.parentElement);
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
