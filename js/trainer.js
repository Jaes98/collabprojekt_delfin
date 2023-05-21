import { getUpdatedFirebase } from "./script.js";
import { getResults, getMemberId } from "./REST.js";
import { ageCalculator } from "./Helper-functions.js";

let resultater;
let listOfMembers;

function startTrainer(array) {
  listOfMembers = array;

  document.querySelector("#trainer-create-result-button").addEventListener("click", createResultClicked);

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
  console.log(resultater);
  document.querySelector("#create-result-modal-trainer").showModal();
  document.querySelector("#create-result-type-trainer").addEventListener("change", changeTrainerForm);

  document.querySelector("#create-result-stævne-trainer").innerHTML = "";
  document.querySelector("#create-result-name-trainer").innerHTML = "";

  const form = document.querySelector("#create-result-form-trainer");

  for (const member of listOfMembers) {
    document.querySelector("#create-result-name-trainer").insertAdjacentHTML("beforeend", `<option value="${member.id}">${member.name}</option>`);
  }

  for (const result of resultater) {
    if (result.competition === true) {
      document.querySelector("#create-result-stævne-trainer").insertAdjacentHTML("beforeend", `<option value="${result.competition}">${result.compName}</option>`);
    }
  }

  function changeTrainerForm(event) {
    console.log("asfasdf");
    const target = event.target.value;
    if (target === "træning") {
      form.place.disabled = false;
      form.date.disabled = false;
      form.stævne.value = "";
      form.stævne.disabled = true;
      form.placement.value = "";
      form.placement.disabled = true;
    } else {
      form.date.disabled = true;
      form.stævne.disabled = false;
      form.placement.disabled = false;
    }
  }
}

export { startTrainer };
