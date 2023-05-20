// import { getUpdatedFirebase } from "./script.js";
import { getResults, getMemberId } from "./REST.js";
import { ageCalculator } from "./Helper-functions.js";

let results;

function startTrainer() {
  updateResults();
}

async function updateResults() {
  results = await getResults();
  showResultTrainer(results);
}

function showResultTrainer(results) {
  console.log("showResults array:", results);

  document.querySelector("#trainer-table-body-senior").innerHTML = "";
  document.querySelector("#trainer-table-body-junior").innerHTML = "";

  for (const result of results) {
    showMemberTrainer(result);
    // console.log(result);
  }
}

async function showMemberTrainer(result) {
  const member = await getMemberId(result.uid);
  console.log("member is: ", member);
  ageCalculator(member);

  // console.log("xxxx", result);

  let competition = "";
  if (result.competition) competition = "Konkurrence";
  else if (result.competition === false) competition = "Træning";

  if (member.age >= 18) {
    const html = /*html*/ `
      <tr class="member-item-kasserer">
      <td>${member.name}</td>
      <td>${competition}</td>
      <td>${result.compName}</td>
      <td>${result.location}</td>
      <td>${result.date}</td>
      <td>${result.discipline}</td>
      <td>${result.time}</td>
      <td>${result.placement}</td>
    </tr>
      `;

    document.querySelector("#trainer-table-body-senior").insertAdjacentHTML("beforeend", html);
  } else if (member.age < 18) {
    const html = /*html*/ `
      <tr class="member-item-kasserer">
      <td>${member.name}</td>
      <td>${competition}</td>
      <td>${result.compName}</td>
      <td>${result.location}</td>
      <td>${result.date}</td>
      <td>${result.discipline}</td>
      <td>${result.time}</td>
      <td>${result.placement}</td>
    </tr>
      `;

    document.querySelector("#trainer-table-body-junior").insertAdjacentHTML("beforeend", html);
  } else {
    console.error("for showMemberTrainer: something is wrong with the age");
  }
}

export { startTrainer };
