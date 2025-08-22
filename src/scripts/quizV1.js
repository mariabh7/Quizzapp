
import Fuse from "https://cdn.jsdelivr.net/npm/fuse.js/dist/fuse.esm.min.js";
export class Userdata {
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
export const users = new Map();