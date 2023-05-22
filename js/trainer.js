import { getUpdatedFirebase } from "./script.js";
import { getResults, creatingResult } from "./REST.js";

let listOfResults;
let listOfMembers;

const topFiveByDiscipline = [];

function startTrainer(array) {
  listOfMembers = array;

  document.querySelector("#btn-trainer-create").addEventListener("click", createResultClicked);
  document.querySelector("#btn-trainer-competition").addEventListener("click", editCompetitionClicked);
  document.querySelector("#create-result-form-trainer").addEventListener("submit", submitResult);
  document.querySelector("#btn-trainer-close").addEventListener("click", () => document.querySelector("#create-result-modal-trainer").close());

  updateResults();
  
  document.querySelector("#topFive-select").addEventListener("change", setValueToTopFiveBy);
}

async function updateResults() {
  listOfResults = await getResults();
  showResultTrainer(listOfResults);
  memberOverviewTrainer(listOfResults);
  // console.log("###########", listOfResults);
}

let valueToTopFiveBy = "junior-crawl";
function setValueToTopFiveBy(params) {
  valueToTopFiveBy = document.querySelector("#topFive-select").value;
  topFiveMembers();
}
function topFiveMembers() {
  let juniorOrSeniorList = [...listOfMembers];
  console.log("virker det nye array?", juniorOrSeniorList);
  for (const member of juniorOrSeniorList) {
    if (valueToTopFiveBy.includes("junior") && member.ageGroup === "Junior") {
      if (member.crawl) {
        member.crawl = "junior-crawl";
      }
      if (member.backcrawl) {
        member.backCrawl = "junior-backcrawl";
      }
      if (member.breaststroke) {
        member.breaststroke = "junior-breaststroke";
      }
      if (member.butterfly) {
        member.butterfly = "junior-butterfly";
      }
    } else {
      if (member.crawl) {
        member.crawl = "senior-crawl";
      } if (member.backcrawl) {
        member.backCrawl = "senior-backcrawl";
      } if (member.breaststroke) {
        member.breaststroke = "senior-breaststroke";
      } if (member.butterfly) {
        member.butterfly = "senior-butterfly";
      }
    }
  }
  
  console.log("er de ændret?", juniorOrSeniorList);
  for (const member of juniorOrSeniorList) {
    if (valueToTopFiveBy.includes("junior")) {
      if (valueToTopFiveBy.includes("crawl")) {
      const crawlFilter = juniorOrSeniorList.filter("")
      topFiveByDiscipline.push(member)
      } if (valueToTopFiveBy.includes("backcrawl")) {

      } if(valueToTopFiveBy.includes("breaststroke")) {

      } if (valueToTopFiveBy.includes("butterfly")) {

      }
      
    } else if (valueToTopFiveBy.includes("senior")) {
      if (valueToTopFiveBy.includes("crawl")) {
        const crawlFilter = juniorOrSeniorList.filter("");
        topFiveByDiscipline.push(member);
      }
      if (valueToTopFiveBy.includes("backcrawl")) {
      }
      if (valueToTopFiveBy.includes("breaststroke")) {
      }
      if (valueToTopFiveBy.includes("butterfly")) {
      }
    }
  }
  console.log("nu skal lortet fandme virke", topFiveByDiscipline);
// console.log("virker skidtet?", topFiveByDiscipline);
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

function createResultClicked(event) {
  
  listOfResults.push({ competition: true, compName: "Vinterstævne" });

  document.querySelector("#create-result-modal-trainer").showModal();
  document.querySelector("#create-result-type-trainer").addEventListener("change", changeFormBasedOnResultType);
  document.querySelector("#create-result-competition-trainer").addEventListener("change", changeFormBasedOnCompetition);

  document.querySelector("#create-result-competition-trainer").innerHTML = "";
  document.querySelector("#create-result-name-trainer").innerHTML = "";

  const form = document.querySelector("#create-result-form-trainer");

  for (const member of listOfMembers) {
    if (member.competetive === "Konkurrent" && member.active === "Aktivt medlem")
      document.querySelector("#create-result-name-trainer").insertAdjacentHTML("beforeend", `<option value="${member.id}">${member.name}</option>`);
  }
  console.log(document.querySelector("#create-result-name-trainer").children);

  const compList = document.querySelector("#create-result-competition-trainer");
  
  for (let i = 0; i < listOfResults.length; i++) {
    const currentResult = listOfResults[i];
  
    let repeatCompetitionCheck = true;
    if (i >= 1) {
      for (const test of compList.children) {
        repeatCompetitionCheck = test.value !== currentResult.compName;
        if (repeatCompetitionCheck === false) break;
      }
    }

    if (currentResult.competition === true && repeatCompetitionCheck) {
      compList.insertAdjacentHTML("beforeend", `<option value="${currentResult.compName}">${currentResult.compName}</option>`);
    }
  }
  console.log(compList.children);

  changeFormBasedOnCompetition();

  function changeFormBasedOnCompetition(event) {
    const selectedCompetition = listOfResults.find((result) => result.compName === form.competition.value);
    form.location.value = selectedCompetition.location;
    form.date.value = selectedCompetition.date;
  }

  function changeFormBasedOnResultType(event) {
    console.log("asejnfdasdf");
    const target = event.target.value;
    console.log(target);
    if (target === "false") {
      form.location.disabled = false;
      form.date.disabled = false;
      form.competition.disabled = true;
      form.placement.disabled = true;
      
      form.date.value = "";
      form.location.value = "";
      form.competition.value = "";
      form.placement.value = "";
    } else {
      form.location.disabled = true;
      form.date.disabled = true;
      form.competition.disabled = false;
      form.placement.disabled = false;
    }
  }
}

function submitResult(event) {
  event.preventDefault();
  const form = event.target;
  const time = form.result.value
  console.log(time)
  if (time.includes(",")){time.replace(",",".")}
  console.log(time)
  const newResult = {
    uid: form.name.value,
    competition: form.type.value === true,
    compName: form.competition.value,
    discipline: form.discipline.value,
    location: form.location.value,
    date: form.date.value,
    time: form.result.value,
    placement: form.placement.value,
  };
  console.log(newResult);
  // creatingResult(newResult)
  // getUpdatedFirebase()
}

function editCompetitionClicked(params) {
  document.querySelector("#show-competition-modal-trainer").showModal();
}

export { startTrainer };