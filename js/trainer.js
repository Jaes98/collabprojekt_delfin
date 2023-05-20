import { getUpdatedFirebase } from "./script.js";
import { getResults, getMemberId } from "./REST.js";
import { ageCalculator } from "./Helper-functions.js";

let resultater;
let listOfMembers;

function startTrainer(array) {
  listOfMembers = array;

  // loopMembers(array);
  updateResults();
}

async function updateResults() {
  resultater = await getResults();
  showResultTrainer(resultater);
}

// function loopMembers(array) {
//   console.log("showmembers array:", array);
//   // document.querySelector("#kasserer-table-body").innerHTML = "";
//   document.querySelector("#trainer-table-body-senior").innerHTML = "";
//   document.querySelector("#trainer-table-body-junior").innerHTML = "";

//   for (const member of array) {
//     if (member.competetive) {
//     showMemberTrainer(member);
//     }
//   }
// }

function showResultTrainer(resultater) {
  console.log("showResults array:", resultater);

  document.querySelector("#trainer-table-body-senior").innerHTML = "";
  document.querySelector("#trainer-table-body-junior").innerHTML = "";

  for (const result of resultater) {
    showMemberTrainer(result);
    // console.log(result);
  }
}

async function showMemberTrainer(result) {
  const member = await getMemberId(result.uid);
  // const resultat = await getResults(result.uid);
  // console.log("member is: ", member);
  // console.log(members);
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
    console.error("for showMemberTrainer: something is wrong");
  }
}

export { startTrainer };
