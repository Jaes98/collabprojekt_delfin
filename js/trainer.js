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


function showTopFiveMembers(array) {
  const competetiveJuniorMembers = {
    crawl: [],
    backCrawl: [],
    breaststroke: [],
    butterfly: [],
  };
  const competetiveSeniorMembers = {
    crawl: [],
    backCrawl: [],
    breaststroke: [],
    butterfly: [],
  };

  for (const memberID of listOfMembers) {
    const member = listOfMembers[memberID];

    if (member.ageGroup === "Junior") {
      if (memberID.crawl) {
        competetiveJuniorMembers.crawl.push(member);
      }

      if (memberID.backCrawl) {
        competetiveJuniorMembers.backCrawl.push(member);
      }

      if (memberID.breaststroke) {
        competetiveJuniorMembers.breaststroke.push(member);
      }

      if (memberID.butterfly) {
        competetiveJuniorMembers.butterfly.push(member);
      }
    }
    if (member.ageGroup === "Senior") {
      if (memberID.crawl) {
        competetiveSeniorMembers.crawl.push(member);
      }

      if (memberID.backCrawl) {
        competetiveSeniorMembers.backCrawl.push(member);
      }

      if (memberID.breaststroke) {
        competetiveSeniorMembers.breaststroke.push(member);
      }

      if (memberID.butterfly) {
        competetiveSeniorMembers.butterfly.push(member);
      }
    }

    // Sorterer members i det nye array efter deres tid
    for (const disciplines in competetiveMembers) {
      competetiveMembers[disciplines].sort((a, b) => {
        return a.time - b.time;
      });
    }

    // Tager members fra det nye array og viser dem
    for (const discipline in disciplineMembers) {
      const members = disciplineMembers[discipline];

      // Display top 5 members for each discipline
      for (let i = 0; i < Math.min(members.length, 5); i++) {
        const member = members[i];

        // Display member's information and result in the HTML table
        const row = document.createElement("tr");
        row.innerHTML = `<td>${discipline}</td><td>${member.name}</td><td>${member.email}</td><td>${member.time}</td>`;
        table.appendChild(row);
      }
    }
}
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
}

export { startTrainer };