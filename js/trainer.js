import { getUpdatedFirebase } from "./script.js";
import { getResults } from "./REST.js";

let resultater;
let listOfMembers;

function startTrainer(array) {
  listOfMembers = array;

  updateResults();
}

async function updateResults() {
  resultater = await getResults();
  showResultTrainer(resultater);
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
