import Fuse from "https://cdn.jsdelivr.net/npm/fuse.js/dist/fuse.esm.min.js";
const users = new Map();
class Userdata {
    constructor(name, major, quizTopic, difficulty, NumofQs) {
        this.name = name;
        this.major = major;
        this.quizTopic = quizTopic;
        this.difficulty = difficulty;
        this.NumofQs = NumofQs
    }
    setData([diff = this.difficulty, Topic = this.quizTopic, NumofQes = this.NumofQs] = []) {
        this.difficulty = diff;
        this.quizTopic = Topic;
        this.NumofQs = NumofQes;
    }
    CheckMajorIsCs() {
        const fuseOptions = {
            isCaseSensitive: false,
            includeScore: true,
            ignoreDiacritics: true,
            // shouldSort: true,
            // includeMatches: false,
            // findAllMatches: false,
            // minMatchCharLength: 1,
            // location: 0,
            // threshold: 0.6,
            // distance: 100,
            // useExtendedSearch: false,
            // ignoreLocation: false,
            // ignoreFieldNorm: false,
            // fieldNormWeight: 1,

        };
        const list = [
            "computer science",
            "cs",
            "software engineer"
        ]
        const fuse = new Fuse(list, fuseOptions);
        return (fuse.search(this.major).length != 0 ? true : false);
    }
}
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
const topicSel = document.getElementById("topicSel");
const diffLevel = document.getElementById("diffLevel");
const NumberOfQA = document.getElementById("NumberOfQA");
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
    let User = new Userdata(userName.value, userMajor.value, topicSel.value, diffLevel.value, parseInt(NumberOfQA.value));
    if (users.has(User.name)) {
        User.setData([diffLevel.value, topicSel.value, parseInt(NumberOfQA.value)])
    } else {
        users.set(User.name, User);
    }
    localStorage.setItem("usersName", User.name);
    document.body.classList.add("fade-out");
    setTimeout(() => {
        window.location.href = "home.html";
    }, 400);
}
