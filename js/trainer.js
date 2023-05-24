import { getUpdatedFirebase } from "./script.js";
import { getResults, getCompetitions, creatingResult, createCompetition, updateResult, sentenceCompetitionToDeletion,deletingResultFromDB,failedPrompt} from "./REST.js";
import { dateChecker, timeChecker,dateToDato,disciplinesEngToDa,competitionBooleanToString } from "./Helper-functions.js";

let listOfResults;
let listOfMembers;
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
  addAgeToResults();
  addNamesToResults();
  setSortAndFilters()
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

function addAgeToResults(params) {
  for (const result of listOfResults) {
    const member = listOfMembers.find((member) => member.id === result.uid);
    if (member !== undefined) {
      if (member.ageGroup === "Senior+") member.ageGroup = "Senior";
      result.ageGroup = member.ageGroup;
    }
  }
}
function topFiveMembers() {
  
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
  let lowerCaseString = valueToTopFiveBy.toLowerCase();
  let hyphenIndex = lowerCaseString.indexOf("-");
  let indexAfterHyphen = lowerCaseString.substring(hyphenIndex + 1);
  let titleCaseString =indexAfterHyphen.charAt(0).toUpperCase() + indexAfterHyphen.slice(1);
  let hyphenToSpaceString = valueToTopFiveBy.replace("-", " ");
  let ageThing = hyphenToSpaceString.substring(0, 6);
  let finalString = `${ageThing} ${titleCaseString}`;
  document.querySelector("#trainer-h2").textContent = `Top 5 ${finalString}`; 

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
  document.querySelector("#trainer-h2").textContent = `Medlemmer`;

  for (const result of results) {
    showMemberTrainer(result);
    // console.log(result);
  }
}

function showMemberTrainer(result) {
  const member = listOfMembers.find((member) => member.id === result.uid);

  if (member) {
    if (member.active === "Aktivt medlem" && member.competetive === "Konkurrent") {
      const fixedStats = {
      competition: competitionBooleanToString(result),
      dato: dateToDato(result),
      disciplines: disciplinesEngToDa(result)}

      const html = /*html*/ `
      <tr class="member-item-kasserer">
      <td>${member.name}</td>
      <td>${member.ageGroup}</td>
      <td>${fixedStats.competition}</td>
      <td>${fixedStats.dato}</td>
      <td>${fixedStats.disciplines}</td>
      <td>${result.time}</td>
      
      </tr>
      `;
      // <td>${result.date}</td>

      document.querySelector("#trainer-table-body").insertAdjacentHTML("beforeend", html);
      document.querySelector("#trainer-table-body tr:last-child").addEventListener("click", () => showMemberModalTrainer(result,fixedStats,member));
    }
  }
}

function showMemberModalTrainer(result,fixedStats,member) {
  console.log(result);
let html;
if(result.competition === false){
  html = /*HTML*/ `
  <article class="modal-item">
    <h3>${member.name}
      <button id="btn-close-modal-trainer" class="buttonAni">Tilbage</button>
    </h3>
    <section id="member-modal-section-trainer">
    <p>Aldersgruppe: ${member.ageGroup}</p>
    <p>Type: ${fixedStats.competition}</p>
    <p>Lokation: ${result.location}</p>
    <p>Dato: ${fixedStats.dato}</p>
    <p>Disciplin: ${fixedStats.disciplines}</p>
    <p>Resultat(sek.): ${result.time}</p>
    </section>
    <button id="btn-delete-result-trainer" class="buttonAni">Slet resultat</button>
    
  </article>
  `;
}
else{
   html = /*HTML*/ `
    <article class="modal-item">
      <h3>${member.name}
        <button id="btn-close-modal-trainer" class="buttonAni">Tilbage</button>
      </h3>
      <section id="member-modal-section-trainer">
      <p>Aldersgruppe: ${member.ageGroup}</p>
      <p>Type: ${fixedStats.competition}</p>
      <p>Stævne: ${result.compName}</p>
      <p>Lokation: ${result.location}</p>
      <p>Dato: ${fixedStats.dato}</p>
      <p>Disciplin: ${fixedStats.disciplines}</p>
      <p>Resultat(sek.): ${result.time}</p>
      <p>Placering: ${result.placement}</p>
      </section>
      <button id="btn-delete-result-trainer" class="buttonAni">Slet resultat</button>
    </article>
    `;
}
  document.querySelector("#show-member-modal-trainer").innerHTML = html;
  document.querySelector("#show-member-modal-trainer").showModal();

  document.querySelector("#btn-close-modal-trainer").addEventListener("click", () => document.querySelector("#show-member-modal-trainer").close());
  document.querySelector("#btn-delete-result-trainer").addEventListener("click", () => deleteResult(result));
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

function createResultClicked(event) {

  document.querySelector("#create-result-modal-trainer").showModal();
  document.querySelector("#create-result-type-trainer").addEventListener("change", changeFormBasedOnResultType);
  document.querySelector("#create-result-competition-trainer").addEventListener("change", changeFormBasedOnCompetition);

  document.querySelector("#create-result-competition-trainer").innerHTML = "";
  document.querySelector("#create-result-name-trainer").innerHTML = "";

  const form = document.querySelector("#create-result-form-trainer");

  for (const member of listOfMembers) {
    if (member.competetive === "Konkurrent" && member.active === "Aktivt medlem") document.querySelector("#create-result-name-trainer").insertAdjacentHTML("beforeend", `<option value="${member.id}">${member.name}</option>`);
  }

  const compList = document.querySelector("#create-result-competition-trainer");
  for (const competition of listOfCompetitions) {
    compList.insertAdjacentHTML("beforeend", `<option value="${competition.compName}">${competition.compName}</option>`);
  }


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
      form.placement.required = false

      form.date.value = "";
      form.location.value = "";
      form.competition.value = "";
      form.placement.value = "";
    } else {
      form.location.disabled = true;
      form.date.disabled = true;
      form.competition.disabled = false;
      form.placement.disabled = false;
      form.placement.required = true
    }
  }
}

async function submitResult(event) {
  event.preventDefault();
  const form = event.target;
  const formTime = timeChecker(form.result.value)
  const formDate = dateChecker(form.date.value)
  const errorMessage = document.querySelector("#result-create-error")

    if(formTime && formDate){
    const newResult = {
      uid: form.name.value,
      competition: form.type.value === "true",
      compName: form.competition.value,
      discipline: form.discipline.value,
      location: form.location.value,
      date: formDate,
      time: formTime,
      placement: form.placement.value,
    };
    const response = await creatingResult(newResult);
    errorMessage.innerHTML=""
    errorMessage.classList.remove("create-error")
    if (response.ok) getUpdatedFirebase();
  }
  else{
    errorMessage.innerHTML = "Forkert dato eller resultat. Tjek datoformat og at tiden er et korrekt tal"
    errorMessage.classList.add("create-error")
  }
}

async function deleteResult(result) {
  console.log(result);
    const deleteModal = document.querySelector("#delete-result-modal-trainer")
    deleteModal.innerHTML = /*html*/ `
    Du er ved at slette ${result.name}s resultat fra ${result.date}. Er du sikker? <br>
    <button id="btn-confirm-result-delete">Slet </button> <br>
    <button id="btn-deny-result-delete"> Fortryd </button>
    `
    const id = result.id
    
    document.querySelector("#btn-confirm-result-delete").addEventListener("click", sendResultToDeletion)
    document.querySelector("#btn-deny-result-delete").addEventListener("click", ()=> deleteModal.close())
    deleteModal.showModal()
  
    async function sendResultToDeletion() {
      const response = await deletingResultFromDB(id)
      if (response.ok){
        deleteModal.close()
        document.querySelector("#show-member-modal-trainer").close();
      getUpdatedFirebase();
      }
    }
  
}

function updateListOfCompetitions() {
  const table = document.querySelector("#competition-table-trainer");
  table.innerHTML = "";
  for (const competition of listOfCompetitions) {
    document
      .querySelector("#competition-table-trainer")
      .insertAdjacentHTML("beforeend", `<tr><td>${competition.compName}</td> <td>${competition.location}</td> <td>${competition.date}</td> <td><button id="btn-competition-delete">Slet stævne</button></td></tr>`);
      document.querySelector("#competition-table-trainer tr:last-child").addEventListener("click", ()=>deleteCompetition(competition))
  }
}

 function deleteCompetition(competition) {
  const deleteModal = document.querySelector("#delete-competiton-modal-trainer")
  deleteModal.innerHTML = /*html*/ `
  Du er ved at slette ${competition.compName}. Er du sikker? <br>
  <button id="btn-confirm-result-delete">Slet </button> <br>
  <button id="btn-deny-result-delete"> Fortryd </button>
  `
  const id = competition.id
  
  document.querySelector("#btn-confirm-result-delete").addEventListener("click", sendCompetitionToDeletion)
  document.querySelector("#btn-deny-result-delete").addEventListener("click", ()=> deleteModal.close())
  deleteModal.showModal()

  async function sendCompetitionToDeletion() {
    const response = await sentenceCompetitionToDeletion(id)
    if (response.ok){
      deleteModal.close()
    getUpdatedFirebase();
    }
  }
}

async function submitCompetition(event) {
  event.preventDefault();
  const form = event.target;
  const errorMessage = document.querySelector("#competition-create-error")

  if (dateChecker(form.date.value)){
    const competitionToSubmit = {
      compName: form.compName.value,
      location: form.location.value,
      date: form.date.value,
    };
    await createCompetition(competitionToSubmit);
    errorMessage.innerHTML = ""
    errorMessage.classList.remove("create-error")
    getUpdatedFirebase();
  }
  else{
    errorMessage.innerHTML = "Forkert dato. Brug formattet: 'åååå-mm-dd'"
    errorMessage.classList.add("create-error")
  }
}

function addNamesToResults() {
  for (const result of listOfResults) {
    const correctMember = listOfMembers.find((member) => member.id === result.uid);
    result.name = correctMember.name;
  }
}

function sortList(listToSort) {
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



async function resultUpdater(event) {
  const resultToUpdate = {
    uid: "-ghdsk-sdljdsj7",
  };

  const id = "id1415";
  updateResult(resultToUpdate, id);
}

export { startTrainer };
