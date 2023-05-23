"use strict";

const dolphinDatabase = "https://delfin-projekt-default-rtdb.europe-west1.firebasedatabase.app";
// const dolphinDatabase = "https://delfin-test-123-default-rtdb.firebaseio.com";

async function getMembers() {
  // henter data og omdanner til objekter
  const membersFromDatabase = await fetch(`${dolphinDatabase}/members.json`);
  const fetchedMembers = await membersFromDatabase.json();

  // sætter members objekter ind i et array
  return prepareData(fetchedMembers);
}

async function getResults() {
  // henter data og omdanner til objekter
  const resultsFromDatabase = await fetch(`${dolphinDatabase}/results.json`);
  const fetchedResults = await resultsFromDatabase.json();
  console.log(fetchedResults);

  // sætter resultatsobjekter ind i et array
  return prepareData(fetchedResults);
}

async function getCompetitions() {
  const resultsFromDatabase = await fetch(`${dolphinDatabase}/competition.json`);
  const fetchedCompetitions = await resultsFromDatabase.json();
  console.log(fetchedCompetitions);
  return prepareData(fetchedCompetitions);
}

async function createCompetition(newCompetition) {
  console.log("creatingResult");
  const json = JSON.stringify(newCompetition);

  const response = await fetch(`${dolphinDatabase}/competition.json`, {
    method: "POST",
    body: json,
  });

  if (response.status === 200) {
    console.log("competition was send to the database");
    successPrompt();
  } else {
    console.error("competition was NOT send to the database");
    failedPrompt();
  }

  return response;
}

function prepareData(listOfObjects) {
  const arrayFromFirebaseObject = [];
  for (const object in listOfObjects) {
    const member = listOfObjects[object];
    member.id = object;
    arrayFromFirebaseObject.push(member);
  }
  return arrayFromFirebaseObject;
}


async function createdMember(newMember) {
  console.log("createdMember");
  const json = JSON.stringify(newMember);

  const response = await fetch(`${dolphinDatabase}/members.json`, {
    method: "POST",
    body: json,
  });

  if (response.status === 200) {
    console.log("member was send to the database");
    successPrompt();
    document.querySelector("#dialog-create-member").close();
  } else {
    console.error("member was NOT send to the database");
    failedPrompt();
  }

  return response;
}

async function updateMemberPUT(memberToUpdate, id) {
  const objectToJSON = JSON.stringify(memberToUpdate);

  const response = await fetch(`${dolphinDatabase}/members/${id}.json`, {
    method: "PUT",
    body: objectToJSON,
  });
  if (response.status === 200) {
    console.log("****************200***************");
    successPrompt();
  } else {
    console.log("################shit#############");
    failedPrompt();
  }

  return response;
}

async function updateMemberPatch(updatedMember, id) {
  const objectToJSON = JSON.stringify(updatedMember);

  const response = await fetch(`${dolphinDatabase}/members/${id}.json`, {
    method: "PATCH",
    body: objectToJSON,
  });
  if (response.status === 200) {
    console.log("****************200***************");
    successPrompt();
  } else {
    console.log("################shit#############");
    failedPrompt();
  }

  return response;
}

// HTTP Method: DELETE
async function deleteMember(id) {
  // Fetch link med præcis ID af det post der skal slettes
  const response = await fetch(`${dolphinDatabase}/members/${id}.json`, {
    method: "DELETE",
  });
  console.log(`${dolphinDatabase}/members/${id}.json`);
  // Hvis response er ok, udskriv log og opdater grid

  if (response.status === 200) {
    console.log("****************200***************");
    successPrompt();
  } else {
    console.log("################shit#############");
    failedPrompt();
  }
  return response;
}

function successPrompt() {
  const alertSuccess = document.createElement("div");
  alertSuccess.id = "successNotifikation";
  alertSuccess.textContent = "Dine ændringer blev gemt";

  document.body.appendChild(alertSuccess);

  // Remove after a few seconds
  setTimeout(() => {
    alertSuccess.remove();
  }, 2000);
}

function failedPrompt() {
  const alertFailed = document.createElement("div");
  alertFailed.id = "failedNotifikation";
  alertFailed.textContent = "Vi kunne ikke gennemføre din anmodning grundet en fejl";

  document.body.appendChild(alertFailed);

  // Remove after a few seconds
  setTimeout(() => {
    alertFailed.remove();
  }, 3001);
}

async function creatingResult(newResult) {
  console.log("creatingResult");
  const json = JSON.stringify(newResult);

  const response = await fetch(`${dolphinDatabase}/results.json`, {
    method: "POST",
    body: json,
  });

  if (response.status === 200) {
    console.log("result was send to the database");
    successPrompt();
    document.querySelector("#create-result-modal-trainer").close();
  } else {
    console.error("result was NOT send to the database");
    failedPrompt();
  }

  return response;
}

async function updateResult(updatedResult, id) {
  const objectToJSON = JSON.stringify(updatedResult);
  console.log(objectToJSON);
  console.log(id);

  const response = await fetch(`${dolphinDatabase}/results/${id}.json`, {
    method: "PATCH",
    body: objectToJSON,
  });
  if (response.status === 200) {
    console.log("****************200***************");
    successPrompt();
  } else {
    console.log("################shit#############");
    failedPrompt();
  }

  return response;
}

async function sentenceCompetitionToDeletion(id) {
    // Fetch link med præcis ID af det post der skal slettes
    const response = await fetch(`${dolphinDatabase}/competition/${id}.json`, {
      method: "DELETE",
    });
    // Hvis response er ok, udskriv log og opdater grid
    if (response.status === 200) {
      console.log("****************200***************");
      successPrompt();
    } else {
      console.log("################shit#############");
      failedPrompt();
    }
    return response;
}

export { updateMemberPUT, createdMember, deleteMember, getMembers, updateMemberPatch, getResults, prepareData, creatingResult, getCompetitions, createCompetition, updateResult, sentenceCompetitionToDeletion };
