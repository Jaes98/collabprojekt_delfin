import { getUpdatedFirebase } from "./script.js";
import { getResults, getMemberId, creatingResult } from "./REST.js";
import { ageCalculator } from "./Helper-functions.js";

let resultater;
let listOfMembers;

function startTrainer(array) {
  listOfMembers = array;

  document.querySelector("#btn-trainer-create").addEventListener("click", createResultClicked);
  document.querySelector("#btn-trainer-competition").addEventListener("click", editCompetitionClicked);
  document.querySelector("#create-result-form-trainer").addEventListener("submit", submitResult);
  document.querySelector("#btn-trainer-close").addEventListener("click", () => document.querySelector("#create-result-modal-trainer").close());

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

  // console.log("xxxx", result);

  let competition = "";

  if (result.competition) competition = "Konkurrence";
  else if (result.competition === false) competition = "Træning";

  // if (member.age >= 18) {
  const html = /*html*/ `
      <tr class="member-item-kasserer">
      <td>${member.name}</td>
      <td>${member.ageGroup}</td>
      <td>${competition}</td>
      <td>${result.date}</td>
      <td>${result.discipline}</td>
      <td>${result.time}</td>
      
    </tr>
      `;

  document.querySelector("#trainer-table-body").insertAdjacentHTML("beforeend", html);
  // } else if (member.age < 18) {
  //   const html = /*html*/ `
  //     <tr class="member-item-kasserer">
  //     <td>${member.name}</td>
  //     <td>${member.ageGroup}</td>
  //     <td>${competition}</td>
  //     <td>${result.date}</td>
  //     <td>${result.discipline}</td>
  //     <td>${result.time}</td>
  //   </tr>
  //     `;

  //   document.querySelector("#trainer-table-body-junior").insertAdjacentHTML("beforeend", html);
  // } else {
  //   console.error("for showMemberTrainer: something is wrong");
  // }
}

function createResultClicked(event) {
  resultater.push({ competition: true, compName: "Vinterstævne" });

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
  
  for (let i = 0; i < resultater.length; i++) {
    const currentResult = resultater[i];
  
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
    const selectedCompetition = resultater.find((result) => result.compName === form.competition.value);
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
  const newResult = {
    uid: form.name.value,
    competition: form.type.value === true,
    compName: form.competition.value,
    discipline: form.discipline.value,
    location: form.location.value,
    date: form.date.value,
    time: Number(form.result.value),
    placement: form.placement.value,
  };
  console.log(newResult);
  creatingResult(newResult)
  getUpdatedFirebase()
}

function editCompetitionClicked(params) {
  document.querySelector("#show-competition-modal-trainer").showModal();
}

export { startTrainer };
