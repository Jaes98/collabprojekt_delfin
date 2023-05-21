import { getUpdatedFirebase } from "./script.js";
import { getResults, getMemberId } from "./REST.js";
import { ageCalculator } from "./Helper-functions.js";

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

const topFiveMembers = [];

for (const disciplines of listOfMembers) {
  
}


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
   const member = listOfMembers.find((member) => member.id === result.uid);

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

function topFiveCrawl() {
  console.log("topFiveDisciplines IGANG DU");

  const crawl = document.querySelector("#topfive-crawl-table-body");

  crawl.insertAdjacentHTML(
    "beforeend",

  )
}
function topFiveBackcrawl() {
  console.log("topFiveBackcrawl IGANG DU");

  const backcrawl = document.querySelector("#topfive-backcrawl-table-body");

  backcrawl.insertAdjacentHTML(
    "beforeend",

    );
}
function topFiveButterfly() {
  console.log("topFiveButterfly IGANG DU");

  const butterfly = document.querySelector("#topfive-butterfly-table-body");

  butterfly.insertAdjacentHTML("beforeend");
}
function topFiveBreaststroke() {
  console.log("topFiveBreaststroke IGANG DU");

  const breaststroke = document.querySelector(
    "#topfive-breaststroke-table-body"
  );

  breaststroke.insertAdjacentHTML(
    "beforeend", 

    );
}
}

export { startTrainer };
