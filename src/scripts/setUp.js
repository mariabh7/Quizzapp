
import { Userdata, users, GetDataViaAPI } from "./quizV1.js";

const forms = document.getElementsByClassName("formC");
const NextButton = document.getElementById("next");
const PrevButton = document.getElementById("prev");
let singleitem = 0;
function showNextStep() {
    if (singleitem < forms.length - 1) {
        singleitem += 1;
    }
    if (singleitem == forms.length - 1) {
        NextButton.textContent = "submit";
    }

}
function showPrevStep() {
    if (singleitem != 0) {
        singleitem -= 1;
    }
    NextButton.textContent = "next";

}
function SelectContent(singleitem) {
    if (singleitem == 0) {
        PrevButton.classList.add("hidden");
    } else {
        PrevButton.classList.remove("hidden");
    }
    for (let i = 0; i < forms.length; i++) {
        if (i == singleitem) {
            forms[i].classList.remove("hidden");
            forms[i].classList.add("flex");

        } else {
            forms[i].classList.add("hidden");
            forms[i].classList.remove("flex");
        }
    }
}
const userName = document.getElementById("Username");
const userMajor = document.getElementById("Usermajor");
const topicSel = document.getElementById("Topic");
const diffLevel = document.getElementById("diff");
const NumberOfQA = document.getElementById("NumofQes");
const ContainerInfo = document.getElementById("TechInfo");
// GetDataViaAPI(topicSel, ContainerInfo);
NextButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (NextButton.textContent === "submit") {
        try {
            ManageData();
        } catch (err) {
            console.log(err)
        }
    }
    showNextStep();
    SelectContent(singleitem);
});
PrevButton.addEventListener("click", (e) => {
    e.preventDefault();
    showPrevStep();
    SelectContent(singleitem);
})

SelectContent(singleitem);

function ManageData() {
    if (userName.value.length == 0 || userMajor.value.length == 0 || diffLevel.value == "level" || parseInt(NumberOfQA.value) == 0) {
        let warning = document.createElement("p");
        warning.textContent = "your submittion failed , please provide Infos"
        warning.className = " my-10 text-red-500"
        document.getElementById("forms").appendChild(warning)
        setTimeout(() => {
            warning.remove();
        }, 5000);
    } else {
        let User = new Userdata(userName.value, userMajor.value, topicSel.value, diffLevel.value, NumberOfQA.value);
        if (users.has(User.name)) {
            User.setData({ [diffLevel.id]: diffLevel.value, [topicSel.id]: topicSel.value, [NumberOfQA.id]: NumberOfQA.value })
        } else {
            users.set(User.name, User);
        }
        localStorage.setItem("usersName", JSON.stringify(User));
        document.body.classList.add("fade-out");
        setTimeout(() => {
            window.location.href = "home.html";
        }, 400);
    }

}
