
import Fuse from "https://cdn.jsdelivr.net/npm/fuse.js/dist/fuse.esm.min.js";
export class Userdata {
    constructor(name, major, quizTopic, difficulty, NumofQs, map) {
        this.name = name;
        this.major = major;
        this.quizTopic = quizTopic;
        this.difficulty = difficulty;
        this.NumofQs = parseInt(NumofQs);
        this.map = map;
    }
    setData({ diff = this.difficulty, Topic = this.quizTopic, NumofQes = this.NumofQs } = {}) {
        this.difficulty = diff;
        this.quizTopic = Topic;
        this.NumofQs = parseInt(NumofQes);
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
    flattenMaps(map) {
        let maps = [];
        let maped = Array.from(map.entries());
        for (let item of maped) {
            if (item[1] instanceof Map) {
                let innerEntry = Array.from(item[1].entries());
                // Replace the inner map with [key, value]
                item[1] = innerEntry;
            }
            maps.push(item);
        }
        return maps;
    }
    setGalleryData(topic, answer) {

        if (this.map === null) {
            this.map = new Map();
        } else {
            this.map = this.GetMap();
        }
        this.map.set(topic, answer);
        this.map = this.flattenMaps(this.map);
    }
    GetMap() {
        for (let item of this.map) {
            if (Array.isArray(item[1])) {
                let innerEntry = new Map(item[1].values());
                // get map from [key, value]
                item[1] = innerEntry;
            }
        }

        return new Map(this.map);
    }

}
export const users = new Map();
export async function GetDataViaAPI(selectEl, ParentEL) {
    // try {
    //     let res = await fetch("https://quizapi.io/api/v1/tags?apiKey=JjfEUVHKdDTfHTso");
    //     let Data = await res.json();
    //     try {
    //         Data.forEach(element => {
    //             let opt = document.createElement("option");
    //             if (element.name != "Undefined") {
    //                 opt.textContent = element.name;
    //                 selectEl.appendChild(opt);
    //             }
    //         });
    //     } catch {
    //         let warning = document.createElement("p");
    //         warning.textContent = "failed to retrieve topic data ! please try again later "
    //         warning.className = " my-10 text-yellow-500 "
    //         ParentEL.appendChild(warning);
    //     }

    // } catch {
    //     console.log("problem loading topics");
    // }
}