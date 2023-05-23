import { getUpdatedFirebase } from "./script.js";
import { getResults, getCompetitions, creatingResult, createCompetition, updateResult } from "./REST.js";

let listOfResults;
let listOfMembers;

let topFiveByDiscipline = [];
let listOfCompetitions;

function startTrainer(array) {
  listOfMembers = array;

  document.querySelector("#btn-trainer-create").addEventListener("click", createResultClicked);
  document.querySelector("#btn-trainer-competition").addEventListener("click", () => document.querySelector("#show-competition-modal-trainer").showModal());
  document.querySelector("#member-search-trainer").addEventListener("keyup", searchBarChanged);
  document.querySelector("#member-search-trainer").addEventListener("search", searchBarChanged);
  document.querySelector("#sort-trainer").addEventListener("change", setSort);
  document.querySelector("#nav-filter-trainer").addEventListener("change", chosenFilter);
  document.querySelector("#create-result-form-trainer").addEventListener("submit", submitResult);
  document.querySelector("#competition-form-trainer").addEventListener("submit", submitCompetition);
  document.querySelector("#btn-trainer-close").addEventListener("click", () => document.querySelector("#create-result-modal-trainer").close());
  document.querySelector("#topFive-select").addEventListener("change", setValueToTopFiveBy);

  updateResultsAndCompetitions();

}

async function updateResultsAndCompetitions() {
  listOfResults = await getResults();
  listOfCompetitions = await getCompetitions();
  updateListOfCompetitions();
  showResultTrainer(listOfResults);
  memberOverviewTrainer(listOfResults);
  addNamesToResults();
}

function setSortAndFilters() {
  const sortedList = sortList(listOfResults);
  const searchedList = sortedList.filter((result) => result.name.toLowerCase().includes(valueToSearchBy));
  const filteredList = filterList(searchedList);
  if (filteredList.length === 0) {
    const noResultsHtml = /* html */ `<p>Ingen resultater fundet.</p>`;
    document.querySelector("#trainer-table-body").innerHTML = noResultsHtml;
  } else showResultTrainer(filteredList);
}

let valueToTopFiveBy = "";
function setValueToTopFiveBy(params) {
  valueToTopFiveBy = document.querySelector("#topFive-select").value;
  topFiveMembers();
}

function topFiveMembers() {
  addAgeToResults();
  function addAgeToResults(params) {
    for (const result of listOfResults) {
      const member = listOfMembers.find((member) => member.id === result.uid);
      if (member !== undefined) {
        if (member.ageGroup === "Senior+") member.ageGroup = "Senior";
        result.ageGroup = member.ageGroup;
      }
    }
  }
  let listOfDesiredResults = [];
  const htmlToDiscipline = valueToTopFiveBy.substring(7);
  const htmlToAgeGroup = valueToTopFiveBy.substring(0, 6);

  for (const result of listOfResults) {
    if (result.discipline === htmlToDiscipline && result.ageGroup === htmlToAgeGroup) listOfDesiredResults.push(result);
  }

  console.log("sorted top 5", listOfDesiredResults.sort((a, b) => a.time - b.time).splice(0, 5));

  const checkCompetitive = listOfMembers.filter((member) => member.competetive === "Konkurrent" && member.active === "Aktivt medlem");

  const checkValueToTopFiveBy = listOfResults.filter((result) => result.discipline === htmlToDiscipline && result.ageGroup === htmlToAgeGroup && checkCompetitive.some((member) => member.id === result.uid));

  checkValueToTopFiveBy.sort((a, b) => a.time - b.time);

  console.log("topFivebyValue Sorteret", checkValueToTopFiveBy);
  if (valueToTopFiveBy === "default") {
    updateResultsAndCompetitions();
  } else {
  showTopFiveTables(checkValueToTopFiveBy);
  }
}
function showTopFiveTables(topFive) {
  document.querySelector("#trainer-table-body").innerHTML = "";

  const slicedTopFive = topFive.slice(0, 5);
  for (let index = 0; index < slicedTopFive.length; index++) {
    const member = slicedTopFive[index];
    showTopFiveTable(member, index+1);
  }
}

function showTopFiveTable(result, index) {
  const member = listOfMembers.find((member) => member.id === result.uid);
  const topFiveHTML = /* html */ `
    <tr>
      <td><b>${index}.</b>   ${member.name}</td>
      <td>${member.ageGroup}</td>
      <td>${competitionBooleanToString(result)}</td>
      <td>${dateToDato(result)}</td>
      <td>${disciplinesEngToDa(result)}</td>
      <td>${result.time}</td>
    </tr>
  `;
  document.querySelector(`#trainer-table-body`).insertAdjacentHTML("beforeend", topFiveHTML);
}

function showResultTrainer(results) {
  document.querySelector("#trainer-table-body").innerHTML = "";

  for (const result of results) {
    showMemberTrainer(result);
    // console.log(result);
  }
}

async function showMemberTrainer(result) {
  const member = listOfMembers.find((member) => member.id === result.uid);

  if (member) {
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
      document.querySelector("#trainer-table-body tr:last-child").addEventListener("click", () => showMemberModalTrainer(result));
    }
  }
}

function showMemberModalTrainer(result) {
  const member = listOfMembers.find((member) => member.id === result.uid);

  const html = /*HTML*/ `
    <article class="modal-item">
      <h3>${member.name}
        <button id="btn-close-modal-trainer" class="buttonAni">Tilbage</button>
      </h3>
      <section id="member-modal-section-trainer">
      <p>Aldersgruppe: ${member.ageGroup}</p>
      <p>Type: ${competitionBooleanToString(result)}</p>
      <p>Stævne: ${result.compName}</p>
      <p>Lokation: ${result.location}</p>
      <p>Dato: ${dateToDato(result)}</p>
      <p>Disciplin: ${disciplinesEngToDa(result)}</p>
      <p>Resultat(sek.): ${result.time}</p>
      <p>Placering: ${result.placement}</p>
      </section>
    </article>
    `;
  document.querySelector("#show-member-modal-trainer").innerHTML = html;
  document.querySelector("#show-member-modal-trainer").showModal();

  document.querySelector("#btn-close-modal-trainer").addEventListener("click", () => document.querySelector("#show-member-modal-trainer").close());
}

function memberOverviewTrainer() {
  // checks active competition members
  const countCompetetive = listOfMembers.filter((member) => member.competetive === "Konkurrent" && member.active === "Aktivt medlem");
  console.log(listOfResults);
  // checks crawl members
  const countCrawl = listOfResults.filter((result) => result.discipline === "crawl" && countCompetetive.some((member) => member.id === result.uid));
  const countCrawlJunior = countCrawl.filter((result) => listOfMembers.some((member) => member.ageGroup === "Junior" && member.id === result.uid)).length;
  const countCrawlSenior = countCrawl.filter((result) => listOfMembers.some((member) => (member.ageGroup === "Senior" || member.ageGroup === "Senior+") && member.id === result.uid)).length;

  // checks backCrawl members
  const countBackCrawl = listOfResults.filter((result) => result.discipline === "backCrawl" && countCompetetive.some((member) => member.id === result.uid));
  const countBackCrawlJunior = countBackCrawl.filter((result) => listOfMembers.some((member) => member.ageGroup === "Junior" && member.id === result.uid)).length;
  const countBackCrawlSenior = countBackCrawl.filter((result) => listOfMembers.some((member) => (member.ageGroup === "Senior" || member.ageGroup === "Senior+") && member.id === result.uid)).length;

  // checks breaststroke members
  const countBreaststroke = listOfResults.filter((result) => result.discipline === "breaststroke" && countCompetetive.some((member) => member.id === result.uid));
  const countBreaststrokeJunior = countBreaststroke.filter((result) => listOfMembers.some((member) => member.ageGroup === "Junior" && member.id === result.uid)).length;
  const countBreaststrokeSenior = countBreaststroke.filter((result) =>
    listOfMembers.some((member) => (member.ageGroup === "Senior" || member.ageGroup === "Senior+") && member.id === result.uid)
  ).length;

  // checks butterfly members
  const countButterfly = listOfResults.filter((result) => result.discipline === "butterfly" && countCompetetive.some((member) => member.id === result.uid));
  const countButterflyJunior = countButterfly.filter((result) => listOfMembers.some((member) => member.ageGroup === "Junior" && member.id === result.uid)).length;
  const countButterflySenior = countButterfly.filter((result) => listOfMembers.some((member) => (member.ageGroup === "Senior" || member.ageGroup === "Senior+") && member.id === result.uid)).length;

  const overview = document.querySelector("#overview-trainer");
  overview.innerHTML = "";
  overview.insertAdjacentHTML(
    "beforeend",
    /*HTML */ `
    <p><B>Antal medlemmer:</B> ${listOfMembers.length}</p>
    <p><b>Aktive konkurrenter:</b> ${countCompetetive.length}</p>
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
    if (member.competetive === "Konkurrent" && member.active === "Aktivt medlem") document.querySelector("#create-result-name-trainer").insertAdjacentHTML("beforeend", `<option value="${member.id}">${member.name}</option>`);
  }
  console.log(document.querySelector("#create-result-name-trainer").children);

  const compList = document.querySelector("#create-result-competition-trainer");
  for (const competition of listOfCompetitions) {
    compList.insertAdjacentHTML("beforeend", `<option value="${competition.compName}">${competition.compName}</option>`);
  }

  // for (let i = 0; i < listOfResults.length; i++) {
  //   const currentResult = listOfResults[i];

  //   let repeatCompetitionCheck = true;
  //   if (i >= 1) {
  //     for (const test of compList.children) {
  //       repeatCompetitionCheck = test.value !== currentResult.compName;
  //       if (repeatCompetitionCheck === false) break;
  //     }
  //   }

  //   if (currentResult.competition === true && repeatCompetitionCheck) {
  //     compList.insertAdjacentHTML("beforeend", `<option value="${currentResult.compName}">${currentResult.compName}</option>`);
  //   }
  // }

  changeFormBasedOnCompetition();

  function changeFormBasedOnCompetition(event) {
    const selectedCompetition = listOfCompetitions.find((competition) => competition.compName === form.competition.value);
    form.location.value = selectedCompetition.location;
    form.date.value = selectedCompetition.date;
  }

  function changeFormBasedOnResultType(event) {
    const target = event.target.value;

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
  const time = form.result.value;
  let actualTime = time;

  if (time.includes(",")) {
    actualTime = time.replace(",", ".");
  }
  if (isNaN(Number(actualTime))) {
    console.log("ERROR: Time is not a number");
  } else {
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
    creatingResult(newResult);
    getUpdatedFirebase();
  }
}

function updateListOfCompetitions() {
  const table = document.querySelector("#competition-table-trainer");
  table.innerHTML = "";
  for (const competition of listOfCompetitions) {
    document
      .querySelector("#competition-table-trainer")
      .insertAdjacentHTML("beforeend", `<tr><td>${competition.compName}</td> <td>${competition.location}</td> <td>${competition.date}</td> <td><button>Slet stævne</button></td></tr>`);
  }
}

function submitCompetition(event) {
  event.preventDefault();
  const form = event.target;

  const dateCheck = Date.parse(form.date.value);

  if (isNaN(dateCheck)) console.error("ERROR: Date is incorrect! Use format: åååå-mm-dd");
  else {
    const competitionToSubmit = {
      compName: form.compName.value,
      location: form.location.value,
      date: form.date.value,
    };
    createCompetition(competitionToSubmit);
    getUpdatedFirebase();
  }
}

function addNamesToResults() {
  for (const result of listOfResults) {
    const correctMember = listOfMembers.find((member) => member.id === result.uid);
    result.name = correctMember.name;
  }
}

function sortList(listToSort) {
  console.log(listToSort);
  console.log("value to sort by:",valueToSortBy);
  if (valueToSortBy === "age") {
    return listToSort.sort((first, second) => first.age - second.age);
  } else {
    return listToSort.sort((member1, member2) => member1[valueToSortBy].localeCompare(member2[valueToSortBy]));
  }
}

let valueToSortBy = "name";
function setSort() {
  valueToSortBy = document.querySelector("#sort-trainer").value;
  setSortAndFilters();
}

let valueToSearchBy = "";
function searchBarChanged() {
  valueToSearchBy = document.querySelector("#member-search-trainer").value;
  setSortAndFilters();
}

let valueToFilterBy = "";
function chosenFilter() {
  valueToFilterBy = document.querySelector("#nav-filter-trainer").value;
  setSortAndFilters();
}

function filterList(searchedList) {
  if (valueToFilterBy === "") return searchedList;
  else if (valueToFilterBy === "true") valueToFilterBy = true;
  else if (valueToFilterBy === "false") valueToFilterBy = false;
  return searchedList.filter((result) => Object.values(result).includes(valueToFilterBy));
}

async function resultUpdater(params) {
  const resultToUpdate = {
    uid: "-ghdsk-sdljdsj7",
  };

  const id = "id1415";
  updateResult(resultToUpdate, id);
}

export { startTrainer };
