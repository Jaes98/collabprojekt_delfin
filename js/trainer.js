import { getUpdatedFirebase } from "./script.js";
import { getResults } from "./REST.js";

let listOfResults;
let listOfMembers;

const topFiveByDiscipline = [];

function startTrainer(array) {
  listOfMembers = array;

  updateResults();
  
  document.querySelector("#topFive-select").addEventListener("change", setValueToTopFiveBy);
}

async function updateResults() {
  listOfResults = await getResults();
  showResultTrainer(listOfResults);
  memberOverviewTrainer(listOfResults);
  // console.log("###########", listOfResults);
}

let valueToTopFiveBy = "crawl";
function setValueToTopFiveBy(params) {
  valueToTopFiveBy = document.querySelector("#topFive-select").value;
  topFiveMembers();
}
function topFiveMembers() {
  for (const member of listOfMembers) {
    if (member.valueToTopFiveBy) {
      topFiveByDiscipline.push(member)
    }
    
}
console.log("virker skidtet?", topFiveByDiscipline);


// a.time/b.time virker ikke da member ikke har time, mangler et resultat at kigge på

// der skal somehow sættes resultater på her nedenunder

topFiveByDiscipline.sort((a, b) => {
a.time - b.time;
});

showTopFiveTables(topFiveByDiscipline);

}
function showTopFiveTables(topFiveList) {

  // somehow lav en slice her så det kun er top 5 members der kommer videre
  showTopFiveTable(topFiveList.slice(0,5))
  // måske sådan

  // for (const discipline in seniorMembers) {
  //   const members = seniorMembers[discipline];
  //   for (const member of members.slice(0, 5)) {
  //     showTopFiveTable(member);
  //   }
  // }
}

function showTopFiveTable(member) {
  let table;

  // lav ting til at beslutte om senior eller junior

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
      <!--<td>${member.resultater?.time}</td> <!-- <td>  -->
      <!--<td>${member.resultater?.placement}</td> <!-- <td>  -->
    </tr>
  `;
  document.querySelector(`#${table}`).insertAdjacentHTML("beforeend", topFiveHTML);
}

function showResultTrainer(results) {
  console.log("showResults array:", results);

  document.querySelector("#trainer-table-body").innerHTML = "";

  for (const result of results) {
    showMemberTrainer(result);
    // console.log(result);
  }
}

async function showMemberTrainer(result) {
  const member = listOfMembers.find((member) => member.id === result.uid);

  // console.log("xxxx", result);
  if (member) {
    console.log(member);
    if (member.active === "Aktivt medlem" && member.competetive === "Konkurrent") {
      const html = /*html*/ `
      <tr class="member-item-kasserer">
      <td>${member.name}</td>
      <td>${member.ageGroup}</td>
      <td>${competitionBooleanToString(result)}</td>
      <td>${dateToDato(result)}</td>
      <td>${disciplinesEngToDa(result)}</td>
      <td>${result.time}</td>
      
    </tr>
      `;

      document.querySelector("#trainer-table-body").insertAdjacentHTML("beforeend", html);
    }
  }
}

function memberOverviewTrainer() {
  // checks active competition members
  const countCompetitive = listOfMembers.filter((member) => member.competetive === "Konkurrent" && member.active === "Aktivt medlem");
console.log(listOfResults);
  // checks crawl members
  const countCrawl = listOfResults.filter((result) => result.discipline === "crawl" && countCompetitive.some((member) => member.id === result.uid));
  const countCrawlJunior = countCrawl.filter((result) => listOfMembers.some((member) => member.ageGroup === "Junior" && member.id === result.uid)).length;
  const countCrawlSenior = countCrawl.filter((result) => listOfMembers.some((member) => (member.ageGroup === "Senior" || member.ageGroup === "Senior+") && member.id === result.uid)).length;

  // checks backCrawl members
  const countBackCrawl = listOfResults.filter((result) => result.discipline === "backCrawl" && countCompetitive.some((member) => member.id === result.uid));
  const countBackCrawlJunior = countBackCrawl.filter((result) => listOfMembers.some((member) => member.ageGroup === "Junior" && member.id === result.uid)).length;
  const countBackCrawlSenior = countBackCrawl.filter((result) => listOfMembers.some((member) => (member.ageGroup === "Senior" || member.ageGroup === "Senior+") && member.id === result.uid)).length;

  // checks breaststroke members
  const countBreaststroke = listOfResults.filter((result) => result.discipline === "breaststroke" && countCompetitive.some((member) => member.id === result.uid));
  const countBreaststrokeJunior = countBreaststroke.filter((result) => listOfMembers.some((member) => member.ageGroup === "Junior" && member.id === result.uid)).length;
  const countBreaststrokeSenior = countBreaststroke.filter((result) => listOfMembers.some((member) => (member.ageGroup === "Senior" || member.ageGroup === "Senior+") && member.id === result.uid)).length;

  // checks butterfly members
  const countButterfly = listOfResults.filter((result) => result.discipline === "butterfly" && countCompetitive.some((member) => member.id === result.uid));
  const countButterflyJunior = countButterfly.filter((result) => listOfMembers.some((member) => member.ageGroup === "Junior" && member.id === result.uid)).length;
  const countButterflySenior = countButterfly.filter((result) => listOfMembers.some((member) => (member.ageGroup === "Senior" || member.ageGroup === "Senior+") && member.id === result.uid)).length;

  const overview = document.querySelector("#overview-trainer");
  overview.innerHTML = "";
  overview.insertAdjacentHTML(
    "beforeend",
    /*HTML */ `
    <p><B>Antal medlemmer:</B> ${listOfMembers.length}</p>
    <p><b>Aktive konkurrenter:</b> ${countCompetitive.length}</p>
    <p><b>Crawl medlemmer:</b> ${countCrawl.length}</p>
    <p>Junior: ${countCrawlJunior}</p>
    <p>Senior: ${countCrawlSenior}</p>
    <p><b>Rygcrawl medlemmer:</b> ${countBackCrawl.length}</p>
    <p>Junior: ${countBackCrawlJunior}</p>
    <p>Senior: ${countBackCrawlSenior}</p>
    <p><b>Brystsvømning medlemmer:</b> ${countBreaststroke.length}</p>
    <p>Junior: ${countBreaststrokeJunior}</p>
    <p>Senior: ${countBreaststrokeSenior}</p>
    <p><b>Butterfly medlemmer:</b> ${countButterfly.length}</p>
    <p>Junior: ${countButterflyJunior}</p>
    <p>Senior: ${countButterflySenior}</p>
    `
  );
  // console.log(member.competetive);
}

function competitionBooleanToString(result) {
  let competition = "";
  if (result.competition) competition = "Konkurrence";
  else if (result.competition === false) competition = "Træning";
  return competition;
}

function disciplinesEngToDa(result) {
  let disciplin = "";
  console.log(result);
  if (result.discipline === "crawl") disciplin = "Crawl";
  else if (result.discipline === "butterfly") disciplin = "Butterfly";
  else if (result.discipline === "backCrawl") disciplin = "Rygcrawl";
  else if (result.discipline === "breaststroke") disciplin = "Bryst svømning";
  return disciplin;
}

function dateToDato(result) {
  let dato = "";
  const dates = result.date.split("-");

  dato = dates[2] + "-" + dates[1] + "-" + dates[0];
  return dato;
}
export { startTrainer };