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
        return new Userdata(data.name, data.major, data.quizTopic, data.difficulty, data.NumofQs, data.map);
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
// current avaible topics 
const topics = ["javascript", "html-5", "css"];
const nums = [3, 5, 10, 15, 20];
const selectDataMap = {
    diff: levels,
    NumofQes: nums,
    Topic: topics
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


const prev = document.getElementById("prev");
const next = document.getElementById("next");
const ContentContainer = document.getElementById("QuizContent");
const startQuizz = document.getElementById("StartQuizz");
const TakeQuiz = document.getElementById("TakeQuiz");
const quizzTaken = document.getElementById("quizzTaken");
const holdQuizzes = document.getElementById("Qcontainer");
let currentItem = 0;
let data;
let Gallery;
const score = document.getElementById("score");
async function GetQuestions() {
    try {

        const topic = OurUser?.quizTopic || "javascript";
        const url = `https://raw.githubusercontent.com/mariabh7/Quizzapp/main/quizzes/${topic}.json`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch questions from GitHub");
        const data = await res.json();

        const difficulty = OurUser?.difficulty;
        let filtered = data;
        if (difficulty) {
            filtered = data.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
        }
        const limit = OurUser?.NumofQs || 5;
        return filtered.slice(0, limit);

    } catch (err) {
        console.log("No questions yet:", err);
        return [];
    }
}
let ShowRightContent = true;
function showQuizorNot() {
    TakeQuiz.classList.toggle("hidden", ShowRightContent);
    quizzTaken.classList.toggle("hidden", !ShowRightContent);
    localStorage.setItem("ShowRightContent", ShowRightContent);
}

// restore state if exists
const saved = localStorage.getItem("ShowRightContent");
if (saved !== null) {
    ShowRightContent = saved === "true";
    showQuizorNot();

}
async function GetDataForQuiz() {
    data = await GetQuestions();
    showCurrentQuestion(currentItem);
}
startQuizz.addEventListener("click", () => {
    GetDataForQuiz();
    currentItem = 0;
    ShowRightContent = false;
    showQuizorNot();
});
// try {
//     data = data ?? JSON.parse(localStorage.getItem("data"));
// } catch (err) {
//     console.log(err)
// }
function showNextStep() {
    if (currentItem < data?.length - 1) {
        currentItem += 1;
    }

}
function showPrevStep() {
    if (currentItem != 0) {
        currentItem -= 1;
    }

}
function escapeHTML(str) {
    return str?.replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
}
function ShowAns() {
    let map = new Map();
    return function AnswersSett(item, ParentEL) {
        const answers = item?.answers;
        if (answers) {
            Object.entries(answers).forEach(([id, value]) => {
                if (value !== null) {
                    let li = document.createElement("li");
                    li.textContent = value;
                    li.id = id;
                    if (map.get(`answer${currentItem}`) === value) {
                        li.className = "answer-Active";
                    } else {
                        li.className = "answer-li";
                    }
                    ParentEL.appendChild(li);
                    li.addEventListener("click", (event) => {
                        li.parentElement.querySelectorAll("li").forEach(el => {
                            el.classList.remove("answer-Active");
                            el.classList.add("answer-li");
                        });
                        li.classList.remove("answer-li");
                        li.classList.add("answer-Active");

                        map.set(`${currentItem}-${li.id}`, [item.correct_answers[`${li.id}_correct`], li.textContent, `${item.explanation || item.answers[`answer_${item.correct_answer}`]}`]);
                        Gallery = map;
                    })
                }
            })
        }
    }
}
const ShowSuggestedAnswers = ShowAns();
function showCurrentQuestion(current) {
    if (data) {
        const item = data.find((cItem, index, array) => index == current);
        ContentContainer.innerHTML = "";
        let div = document.createElement("div");
        div.innerHTML = `
    <h3 class=" text-lg md:text-xl font-semibold first-letter:capitalize  text-blue-600 ">${currentItem + 1}- ${escapeHTML(item?.question)}</h3>
    <div><ul id="suggestedAnswers" class=" mt-4 md:mt-8 flex flex-col gap-5  md:gap-8 "></ul>
    </div>`
        ShowSuggestedAnswers(item, div.querySelector("#suggestedAnswers"));
        ContentContainer.appendChild(div);
        if (currentItem == data?.length - 1) {
            next.textContent = "submit";
        } else {
            next.textContent = "next";
        }
    } else {
        TakeQuiz.innerHTML = "";
        let div = document.createElement("div");
        div.innerHTML = `
        <h3 class=" text-lg md:text-xl font-semibold first-letter:capitalize  text-blue-600 ">sorry we couldnt find any matching quizzes for your theme try again with another one  </div>`
        TakeQuiz.appendChild(div);
        setTimeout(() => {
            ShowRightContent = true;
            showQuizorNot();
        }, 5000)
    }
}
function Addtogallery() {
    OurUser.setGalleryData(OurUser.quizTopic, Gallery);
    localStorage.setItem("usersName", JSON.stringify(OurUser));
    DisplayGallery(Gallery);
    console.log(OurUser.GetMap());
}
function UpdateGalleryDom() {
    if (OurUser.GetMap().size !== 0) {
        quizzTaken.innerHTML = holdQuizzes;
    } else {
        quizzTaken.innerHTML = `<span class="capitalize text-2xl font-luckiest tracking-widest ">found element</span>`;
    }
}
function DisplayGallery(gal) {
    let div = document.createElement("div");
    div.innerHTML = `<div class="flex flex-col gap-8 py-4  border-2 border-gray-100 rounded-xl">
                        <div class=" flex justify-center items-start w-full pb-2  border-b-2 border-gray-100 ">
                            <img src="https://api.iconify.design/logos:${OurUser.quizTopic}.svg" class="w-10">
                        </div>
                        <div class="mx-3">
                            <div class="flex flex-col justify-start gap-4 ">
                                <div class="g-info">
                                    <div class="w-6 h-6 rounded-full bg-[conic-gradient(#22c55e_${Math.floor((parseInt(score.textContent) / parseInt(OurUser.NumofQs) * 100))}%,#e5e7eb_0)] flex items-center justify-center">
                                        <div  class="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                                         </div>
                                    </div>
                                    <div class="flex text-sm  justify-start gap-1 ">
                                                    <span class="text-gray-500">correct answers</span>
                                                    <span>${Math.round((parseInt(score.textContent) / parseInt(OurUser.NumofQs) * 100))}</span>
                                    </div>
                                            </div>
                                    <div class="g-info">
                                                <div
                                                    class="w-6 h-6 rounded-full  bg-[conic-gradient(#22c55e_${Math.floor((gal.size / parseInt(OurUser.NumofQs) * 100))}%,#e5e7eb_0)]  flex items-center justify-center">
                                                    <div
                                                        class="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                                                    </div>
                                                </div>
                                                <div class="flex text-sm  justify-start gap-1 ">
                                                    <span class="text-gray-500">completions</span>
                                                    <span>${Math.floor((gal.size / parseInt(OurUser.NumofQs) * 100))} </span>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div class="mx-3 text-gray-500 flex justify-between items-center gap-2">
                                        <span>1 min ago</span>
                                        <div class="flex justify-start gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                                                viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="1.25"
                                                stroke-linecap="round" stroke-linejoin="round">
                                                <path d="M8 9h8" />
                                                <path d="M8 13h6" />
                                                <path
                                                    d="M14 18h-1l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v4.5" />
                                                <path d="M19 22v.01" />
                                                <path
                                                    d="M19 19a2.003 2.003 0 0 0 .914 -3.782a1.98 1.98 0 0 0 -2.414 .483" />
                                            </svg>
                                            <span>${OurUser.NumofQs} questions</span>
                                        </div>
                                    </div>
                                </div>`
    // for (const [key, value] of gal) {
    //     console.log(key, value);
    // }
    holdQuizzes.appendChild(div);
}
function CalculateScore(QuizMap, quiztopic) {
    let lscore = parseInt(score.textContent);
    if (OurUser.GetMap().has(quiztopic)) {
        let topicAnswers = QuizMap;
        for (let [key, value] of topicAnswers) {
            if (value[0] == 'true') {
                lscore++;
                console.log(lscore);
            }
        }
        score.textContent = lscore;

    }
}
// UpdateGalleryDom();

prev.addEventListener("click", () => {
    showPrevStep();
    showCurrentQuestion(currentItem);
})
next.addEventListener("click", (e) => {
    if (next.textContent == "submit") {
        Addtogallery()
        CalculateScore(Gallery, OurUser.quizTopic);
        ShowRightContent = true;
        showQuizorNot();

    } else {
        showNextStep();
        showCurrentQuestion(currentItem);
    }
})