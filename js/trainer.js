import { getUpdatedFirebase } from "./script.js";
import { getResults } from "./REST.js";

let resultater;
let listOfMembers;

const competetiveJuniorMembers = {
  crawl: [],
  backcrawl: [],
  breaststroke: [],
  butterfly: [],
};
const competetiveSeniorMembers = {
  crawl: [],
  backcrawl: [],
  breaststroke: [],
  butterfly: [],
};

function startTrainer(array) {
  listOfMembers = array;

  updateResults();
  topFiveMembers();
}

async function updateResults() {
  resultater = await getResults();
  showResultTrainer(resultater);
}


function topFiveMembers() {
  for (const memberID of listOfMembers) {
    console.log("memberID tingen", memberID);

    if (memberID.ageGroup === "Junior") {
      if (memberID.crawl) {
        competetiveJuniorMembers.crawl.push(memberID);
      } if (memberID.backcrawl) {
        competetiveJuniorMembers.backcrawl.push(memberID);
      } if (memberID.breaststroke) {
        competetiveJuniorMembers.breaststroke.push(memberID);
      } if (memberID.butterfly) {
        competetiveJuniorMembers.butterfly.push(memberID);
      };
    } else if (memberID.ageGroup === "Senior") {
      if (memberID.crawl) {
        competetiveSeniorMembers.crawl.push(memberID);
      } if (memberID.backcrawl) {
        competetiveSeniorMembers.backcrawl.push(memberID);
      } if (memberID.breaststroke) {
        competetiveSeniorMembers.breaststroke.push(memberID);
      } if (memberID.butterfly) {
        competetiveSeniorMembers.butterfly.push(memberID);
      }
    }

}
const sorta = competetiveJuniorMembers.butterfly.sort((a, b) => {
  a.time - b.time;
});
console.log("sort a", sorta);

const time = competetiveJuniorMembers.butterfly.time
console.log("timetingeling", time);

// for (const discipline of competetiveJuniorMembers.crawl) {
//  console.log("loopet af members crawl", discipline);
//   discipline.sort((a, b) => {
//     return a.time - b.time;
//   });
// }
// for (const discipline of competetiveJuniorMembers.backcrawl) {
//   competetiveJuniorMembers[discipline].sort((a, b) => {
//     return a.time - b.time;
//   });
// }
// for (const discipline of competetiveJuniorMembers.breaststroke) {
//   competetiveJuniorMembers[discipline].sort((a, b) => {
//     return a.time - b.time;
//   });
// }
// for (const discipline of competetiveJuniorMembers.butterfly) {
//   competetiveJuniorMembers[discipline].sort((a, b) => {
//     return a.time - b.time;
//   });
// }
// for (const discipline of competetiveSeniorMembers.crawl) {
//   competetiveSeniorMembers[discipline].sort((a, b) => {
//     return a.time - b.time;
//   });
// }
// for (const discipline of competetiveSeniorMembers.backcrawl) {
//    competetiveSeniorMembers[discipline].sort((a, b) => {
//      return a.time - b.time;
//    });
//  }
// for (const discipline of competetiveSeniorMembers.breaststroke) {
//     competetiveSeniorMembers[discipline].sort((a, b) => {
//       return a.time - b.time;
//     });
//   }
// for (const discipline of competetiveSeniorMembers.butterfly) {
//      competetiveSeniorMembers[discipline].sort((a, b) => {
//        return a.time - b.time;
//      });
//    }

showTopFiveTables(competetiveJuniorMembers, competetiveSeniorMembers);

}
function showTopFiveTables(juniorMembers, seniorMembers) {

  for (const discipline in juniorMembers) {
    const members = juniorMembers[discipline];
    for (const member of members.slice(0, 5)) {
      showTopFiveTable(member);
    }
  }

  for (const discipline in seniorMembers) {
    const members = seniorMembers[discipline];
    for (const member of members.slice(0, 5)) {
      showTopFiveTable(member);
    }
  }
}

function showTopFiveTable() {
  let table;

  // if (member.ageGroup === "Junior") {
  //   if (member.crawl) {
  //     table = "topfive-crawl-junior-table-body";
  //   } else if (member.backcrawl) {
  //     table = "topfive-backcrawl-junior-table-body"
  //   }else if (member.breaststroke) {
  //     table = "topfive-breaststroke-junior-table-body";
  //   }else if (member.butterfly) {
  //     table = "topfive-butterfly-junior-table-body";
  //   }
  // } else if (member.ageGroup === "Senior") {
  //   if (member.crawl) {
  //     table = "#topfive-crawl-senior-table-body"
  //   } else if (member.backcrawl) {
  //     table = "topfive-backcrawl-senior-table-body";
  //   }else if (member.breaststroke) {
  //     table = "topfive-breaststroke-senior-table-body";
  //   }else if (member.butterfly) {
  //     table = "topfive-butterfly-senior-table-body";
  //   }
  // }

const topFiveHTML = /* html */ `
    <tr>
      <td>${member.name}</td>
      <td>${member.ageGroup}</td>
      <td>${member.time}</td>
      <td>${member.placement}</td>
    </tr>
  `;
  document.querySelector(`#${table}`).insertAdjacentHTML("beforeend", topFiveHTML);
}

function showResultTrainer(resultater) {
  console.log("showResults array:", resultater);

  document.querySelector("#trainer-table-body").innerHTML = "";

  for (const result of resultater) {
    showMemberTrainer(result);
    // console.log(result);
  }
}

async function showMemberTrainer(result) {
  const member = listOfMembers.find((member) => member.id === result.uid);
  disciplinesEngToDa(result);
  competitionBooleanToString(result);
  dateToDato(result);

  // console.log("xxxx", result);

  const html = /*html*/ `
      <tr class="member-item-kasserer">
      <td>${member.name}</td>
      <td>${member.ageGroup}</td>
      <td>${member.competition}</td>
      <td>${member.dato}</td>
      <td>${member.disciplin}</td>
      <!--<td>${result.time}</td> <!-- <td>  -->
      
    </tr>
      `;

  document.querySelector("#trainer-table-body").insertAdjacentHTML("beforeend", html);
}

let competition = "";
function competitionBooleanToString(result) {
  if (result.competition) competition = "Konkurrence";
  else if (result.competition === false) competition = "Træning";
}

let disciplin = "";
function disciplinesEngToDa(result) {
  console.log(result);
  if (result.discipline === "crawl") disciplin = "Crawl";
  else if (result.discipline === "butterfly") disciplin = "Butterfly";
  else if (result.discipline === "backCrawl") disciplin = "Rygcrawl";
  else if (result.discipline === "breaststroke") disciplin = "Bryst svømning";
}

let dato = "";
function dateToDato(result) {
const dates = result.date.split("-");

dato = dates[2] + "-" + dates[1] + "-" + dates[0];

}
export { startTrainer };