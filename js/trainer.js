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
  const competitiveMembers = {
    crawl: [],
    backCrawl: [],
    breaststroke: [],
    butterfly: [],
  };

  for (const disciplines of listOfMembers) {
  }
  // Retrieve the members data from the database
  const membersRef = firebase.database().ref("members");
  membersRef
    .once("value")
    .then((snapshot) => {
      const membersData = snapshot.val();

      // Create an object to store members for each discipline
      const disciplineMembers = {
        crawl: [],
        backCrawl: [],
        breaststroke: [],
        butterfly: [],
      };

      // Iterate over the members directly
      for (const memberID in membersData) {
        const member = membersData[memberID];

        // Check if the member participates in each discipline and add them to the corresponding array
        if (member.crawl) {
          disciplineMembers.crawl.push(member);
        }

        if (member.backCrawl) {
          disciplineMembers.backCrawl.push(member);
        }

        if (member.breaststroke) {
          disciplineMembers.breaststroke.push(member);
        }

        if (member.butterfly) {
          disciplineMembers.butterfly.push(member);
        }
      }

      // Sort members in each discipline by their time
      for (const discipline in disciplineMembers) {
        disciplineMembers[discipline].sort((a, b) => {
          // Assuming the time property exists in your member object
          return a.time - b.time;
        });
      }

      // Iterate over the sorted members in each discipline and display them in the HTML table
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

      // Append the table to the document body or any other desired location
      document.body.appendChild(table);
    })
    .catch((error) => {
      console.error("Failed to retrieve members data:", error);
    });
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