
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
    console.log(item.quizTopic);
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
const TimerWr = document.getElementById("timer");
const TimerSettModal = document.getElementById("Timersett");
const Minutes = document.getElementById("GetMins");
const Seconds = document.getElementById("GetSecs");
const min = document.getElementById("Min");
const secOfT = document.getElementById("sec");
TimerWr.addEventListener("click", () => {
    TimerSettModal.classList.remove("hidden");
})
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
let ispaused = false;
// countDown function 
function timer({ minutes, seconds }) {
    let minInt = parseInt(minutes);
    let secInt = parseInt(seconds);
    let timerV;
    setTimeout(function countdown() {
        if (ispaused) {
            return;
        }
        if (minInt === 0 && secInt === 0) {
            return;
        }
        if (secInt === 0) {
            secInt = 59;
            minInt -= 1;
        } else {
            secInt -= 1;
        }
        document.getElementById("time").textContent = `${String(minInt).padStart(2, '0')}:${String(secInt).padStart(2, '0')}`;
        Minutes.value = `${String(minInt).padStart(2, '0')}`;
        Seconds.value = `${String(secInt).padStart(2, '0')}`;
        timerV = setTimeout(countdown, 1000);

    }, 1000)
    document.getElementById("resetTimer").addEventListener("click", () => {
        ResetTimer(timerV);
    })
    document.getElementById("PoseTimer").addEventListener("click", () => {
        stopTimer(minInt, secInt);
    })

}

function ResetTimer(timer) {
    clearTimeout(timer);
    Minutes.value = "00";
    Seconds.value = "00";
    document.getElementById("time").textContent = "00:00";
}
function stopTimer(CurrentMins, CurrentSec) {
    ispaused = true;
    document.getElementById("time").textContent = `${String(CurrentMins).padStart(2, '0')}:${String(CurrentSec).padStart(2, '0')}`
}
function StartTimer() {
    let data = {
        minutes: Minutes.value,
        seconds: Seconds.value
    }
    for (let key in data) {
        if (data[key].length == 0) {
            data[key] = "00";

        }
    }
    if (data.seconds.length == 1) {
        let newVal = Array.from(data.seconds);
        newVal.splice(1, 0, "0");
        data.seconds = newVal.join('');
    }
    ispaused = false;
    timer(data);
}
document.getElementById("startTimer").addEventListener("click", () => {
    StartTimer();
    TimerSettModal.classList.add("hidden");
})
timerSEttings();
document.addEventListener("click", (event) => {
    if (!document.getElementById("containerTimer").contains(event.target) && event.target !== TimerWr) {
        TimerSettModal.classList.add("hidden");
    }
});