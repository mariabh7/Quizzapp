
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
