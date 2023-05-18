// import { getUpdatedFirebase } from "./script.js";
import {  getResults, getMemberId } from "./REST.js";
// getMembers


let members;
let results;

function startTrainer(array) {

  updateResults();
  // members = array;

}

async function updateResults() {
  results = await getResults();
  // members = await getMembers();
  showResultTrainer(results, members);
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
  const memberUid = await getMemberId(result.uid);

  
    const birthday = new Date(memberUid.bday);
    const today = new Date();
    const ageInMilis = today - birthday;
    const miliSecondsInAYear = 1000 * 60 * 60 * 24 * 365;
    memberUid.age = Math.floor(ageInMilis / miliSecondsInAYear);
  

  

  if (memberUid.age >= 18) {
    const html = /*html*/ `
      <tr class="member-item-kasserer">
      <td>${memberUid.name}</td>
      <td>${result.competition}</td>
      <td>${result.compName}</td>
      <td>${result.location}</td>
      <td>${result.date}</td>
      <td>${result.discipline}</td>
      <td>${result.time}</td>
      <td>${result.placement}</td>
    </tr>
      `;

    document.querySelector("#trainer-table-body-senior").insertAdjacentHTML("beforeend", html);
  } else if (memberUid.age < 18) {
 const html = /*html*/ `
      <tr class="member-item-kasserer">
      <td>${memberUid.name}</td>
      <td>${result.competition}</td>
      <td>${result.compName}</td>
      <td>${result.location}</td>
      <td>${result.date}</td>
      <td>${result.discipline}</td>
      <td>${result.time}</td>
      <td>${result.placement}</td>
    </tr>
      `;

 document.querySelector("#trainer-table-body-junior").insertAdjacentHTML("beforeend", html);
  } else {console.error("for showMemberTrainer: something is wrong with the age");}
}

export { startTrainer };
