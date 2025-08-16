import Fuse from "https://cdn.jsdelivr.net/npm/fuse.js/dist/fuse.esm.min.js";
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
let user = new Userdata("maria", "Cloud Computing", "js", "hard", 8);
const forms = document.getElementsByClassName("formC");
const NextButton = document.getElementById("next");
const PrevButton = document.getElementById("prev");
let singleitem = 0;
function showNextStep() {
    if (singleitem < forms.length - 1) {
        singleitem += 1;
    }
    if (singleitem == forms.length - 1) {
        console.log(singleitem)
        NextButton.textContent = "submit";
    }

}
function showPrevStep() {
    if (singleitem != 0) {
        singleitem -= 1;
    }
    NextButton.textContent = "next";

}
function SelectCont(singleitem) {
    if (singleitem == 0) {
        PrevButton.classList.add("hidden");
    } else {
        PrevButton.classList.remove("hidden");
    }
    for (let i = 0; i < forms.length; i++) {
        if (i == singleitem) {
            console.log(forms[i])
            forms[i].classList.remove("hidden");
            forms[i].classList.add("flex");

        } else {

            forms[i].classList.add("hidden");
            forms[i].classList.remove("flex");
        }
    }
}
NextButton.addEventListener("click", (e) => {
    e.preventDefault();
    showNextStep();
    SelectCont(singleitem);
});
PrevButton.addEventListener("click", (e) => {
    e.preventDefault();
    showPrevStep();
    SelectCont(singleitem);
})
SelectCont(singleitem);