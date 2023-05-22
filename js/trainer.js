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

    if (memberID.ageGroup === "Junior") {
      if (memberID.crawl) {
        competetiveJuniorMembers.crawl.push(memberID);
      } else if (memberID.backcrawl) {
        competetiveJuniorMembers.backcrawl.push(memberID);
      } else if (memberID.breaststroke) {
        competetiveJuniorMembers.breaststroke.push(memberID);
      } else if (memberID.butterfly) {
        competetiveJuniorMembers.butterfly.push(memberID);
      };
    }
  
    if (memberID.ageGroup === "Senior") {
      if (memberID.crawl) {
        competetiveSeniorMembers.crawl.push(memberID);
      } else if (memberID.backcrawl) {
        competetiveSeniorMembers.backcrawl.push(memberID);
      } else if (memberID.breaststroke) {
        competetiveSeniorMembers.breaststroke.push(memberID);
      } else if (memberID.butterfly) {
        competetiveSeniorMembers.butterfly.push(memberID);
      }
    }

  console.log("Nye lister, henholdsvis junior og så senior:", competetiveJuniorMembers, competetiveSeniorMembers);

 
 for (const discipline in competetiveJuniorMembers.crawl) {
  console.log("loopet af members crawl", discipline);
   discipline.sort((a, b) => {
     return a.time - b.time;
   });
 }
 for (const discipline in competetiveJuniorMembers.backcrawl) {
   competetiveJuniorMembers[discipline].sort((a, b) => {
     return a.time - b.time;
   });
 }
 for (const discipline in competetiveJuniorMembers.breaststroke) {
   competetiveJuniorMembers[discipline].sort((a, b) => {
     return a.time - b.time;
   });
 }
 for (const discipline in competetiveJuniorMembers.butterfly) {
   competetiveJuniorMembers[discipline].sort((a, b) => {
     return a.time - b.time;
   });
 }
 for (const discipline in competetiveSeniorMembers.crawl) {
   competetiveSeniorMembers[discipline].sort((a, b) => {
     return a.time - b.time;
   });
 }
for (const discipline in competetiveSeniorMembers.backcrawl) {
    competetiveSeniorMembers[discipline].sort((a, b) => {
      return a.time - b.time;
    });
  }
for (const discipline in competetiveSeniorMembers.breaststroke) {
     competetiveSeniorMembers[discipline].sort((a, b) => {
       return a.time - b.time;
     });
   }
for (const discipline in competetiveSeniorMembers.butterfly) {
      competetiveSeniorMembers[discipline].sort((a, b) => {
        return a.time - b.time;
      });
    }
}
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

  if (member.ageGroup === "Junior") {
    if (member.crawl) {
      table = "topfive-crawl-junior-table-body";
    } else if (member.backcrawl) {
      table = "topfive-backcrawl-junior-table-body"
    }else if (member.breaststroke) {
      table = "topfive-breaststroke-junior-table-body";
    }else if (member.butterfly) {
      table = "topfive-butterfly-junior-table-body";
    }
  } else if (member.ageGroup === "Senior") {
    if (member.crawl) {
      table = "#topfive-crawl-senior-table-body"
    } else if (member.backcrawl) {
      table = "topfive-backcrawl-senior-table-body";
    }else if (member.breaststroke) {
      table = "topfive-breaststroke-senior-table-body";
    }else if (member.butterfly) {
      table = "topfive-butterfly-senior-table-body";
    }
  }
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
      <td>${competition}</td>
      <td>${dato}</td>
      <td>${disciplin}</td>
      <td>${result.time}</td>
      
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