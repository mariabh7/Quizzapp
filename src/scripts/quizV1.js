// // fetch("https://quizapi.io/api/v1/questions?apiKey=y65cYlPTkSDaUdayGMs2iiRrJjfEUVHKdDTfHTso&difficulty=Easy&limit=10&tags=JavaScript")
// //     .then(res => res.json())
// //     .then(data => {
// //         console.log(data);
// //     })
// class UnAuth extends Error {
//      constructor(message){
//        super(message) ;
//          this.name = "UnAuth";
//      }
// }
// try {
//     fetch("https://quizapi.io/api/v1/questions?apiKey=y65cYlPTkSDUdayGMs2iiRrJjfEUVHKdDTfHTso&difficulty=Easy&limit=10&tags=JavaScript")
//         .then(res => res.json())
//         .then(data => {
//             console.log(data);
//         })

// } catch (err) {
//     console.log(err);
// }
// console.log("rest of script still executed script didnt stop")
// const add = () => {
//     console.log(5 + 4);
// }
// add8
new Promise(function (resolve, reject) {
    setTimeout(() => {
        reject(new Error("Whoops!"))
    }, 1000);
}).catch(alert);