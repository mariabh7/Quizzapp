
import { Userdata } from "./quizV1.js";
const name = document.getElementById("GetName");
const topiVal = document.getElementById("topic");
const levelVal = document.getElementById("difficulty");
const QsNumber = document.getElementById("NumOfQA");
const suggestionModal = document.getElementById("modal-sugg");
function setUserInfo() {
    let data = JSON.parse(localStorage.getItem("usersName"));
    const item = new Userdata(data.name, data.major, data.quizTopic, data.difficulty, data.NumofQs);
    name.textContent = item.name;
    topiVal.textContent = item.quizTopic;
    levelVal.textContent = item.difficulty;
    QsNumber.textContent = item.NumofQs;
    document.getElementById("majorOfuser").textContent = item.major;
    let colorClasses = {
        hard: ["bg-red-500", "border-red-500"],
        meduim: ["bg-yellow-500", "border-yellow-500"],
        easy: ["bg-green-400", "border-green-400"]
    };
    levelVal.parentElement.classList.add(...(colorClasses[levelVal.textContent] || []));
    if (!item.CheckMajorIsCs()) {
        if (!localStorage.getItem("suggestionShowsn")) {
            let ShowSugg = setTimeout(() => {
                suggestionModal.classList.remove("hidden");
                document.querySelector(".Hide").addEventListener("click", () => {
                    clearTimeout(ShowSugg);
                    suggestionModal.classList.add("hidden");
                })
                // mark as shown forever
                localStorage.setItem("suggestionShowsn", "true");
            }, 2000);
        }
    }
}

setUserInfo();
const TimerSettModal = document.getElementById("Timersett");
const TimerWr = document.getElementById("timer");
TimerWr.addEventListener("click", () => {
    TimerSettModal.classList.remove("hidden");
})
document.addEventListener("click", (event) => {
    if (!document.getElementById("containerTimer").contains(event.target) && event.target !== TimerWr) {
        TimerSettModal.classList.add("hidden");
    }
});
const Minutes = document.getElementById("GetMins");
const Seconds = document.getElementById("GetSecs");
const TimerC = document.getElementById("time");
function timerSEttings() {
    document.querySelectorAll("input").forEach(element => {
        element.addEventListener("input", () => {
            if (element.value.length > 2) {
                element.value = element.value.slice(0, 2);
            }
            if (element.dataset.min = "secs") {
                if (parseInt(element.value) > 59) {
                    element.value = "00"
                }
            }
        })
    });

}
// countDown function 
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
    // clock ticking logic 
    ticking() {
        if (this.isPaused) {
            return;
        }
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
        this.timerV = setTimeout(() => { this.ticking() }, 1000);
    }
    // start timer 
    start() {
        this.minInt = parseInt(this.minInput.value) || 0;
        this.secInt = parseInt(this.secInput.value) || 0;
        this.isPaused = false;
        this.updateDisplay();
        this.ticking();
    }
    // pause the timer
    pause() {
        this.isPaused = true;
        clearTimeout(this.timerV);
        this.timerV = null;
    }
    // resume timer where it stopped 
    resume() {
        if (this.isPaused) {
            this.isPaused = false;
            this.ticking();
        }
    }
    // reset timer 
    reset() {
        this.stop();
        this.minInt = 0;
        this.secInt = 0;
        this.updateDisplay();
    }
    // stop and clear timer 
    stop() {
        clearTimeout(this.timerV);
        this.timerV = null;
    }
    SaveToLocal() {
        localStorage.setItem("TimerData", this.minInt);
    }
}
let clock = new Timer(Minutes, Seconds, TimerC)

document.getElementById("resetTimer").addEventListener("click", () => {
    clock.reset();
})
document.getElementById("PoseTimer").addEventListener("click", () => {
    clock.pause();
})
document.getElementById("startTimer").addEventListener("click", () => {
    if (clock.isPaused) {
        clock.resume();
    } else {
        clock.start();
    }

    TimerSettModal.classList.add("hidden");
})
timerSEttings();