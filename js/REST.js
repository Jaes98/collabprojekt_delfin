"use strict";

const dolphinDatabase = "https://delfin-projekt-default-rtdb.europe-west1.firebasedatabase.app";
// const dolphinDatabase = "https://delfin-test-123-default-rtdb.firebaseio.com";

async function getMembers() {
  // henter data og omdanner til objekter
  const membersFromDatabase = await fetch(`${dolphinDatabase}/members.json`);
  const fetchedMembers = await membersFromDatabase.json();

  // sætter members objekter ind i et array
  // const membersToArray = prepareData(fetchedMembers);
  // return membersToArray;

  // Busters note: Vi kan vel bare returne med det samme, vi bruger vist ikke memeberstoarray til andet?:
  return prepareData(fetchedMembers);
}

async function getResults() {
  // henter data og omdanner til objekter
  const resultsFromDatabase = await fetch(`${dolphinDatabase}/results.json`);
  const fetchedResults = await resultsFromDatabase.json();

  // sætter members objekter ind i et array
  // const membersToArray = prepareData(fetchedMembers);
  // return membersToArray;

  // Busters note: Vi kan vel bare returne med det samme, vi bruger vist ikke memeberstoarray til andet?:
  // return prepareData(fetchedResults);
  return prepareData2(fetchedResults);
}

async function getMemberId(id) {
  const memberIdList = await fetch(`${dolphinDatabase}/members/${id}.json`);
  const memberId = await memberIdList.json();

  return memberId;
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

function prepareData2(fetchedResults) {
  const arrayObject = [];
  for (const object in fetchedResults) {
    const result = fetchedResults[object];
    result.id = object;
    arrayObject.push(result);
  }
  return arrayObject;
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
  }, 3000);
}

export { updateMemberPUT, createdMember, deleteMember, getMembers, updateMemberPatch, getResults, prepareData, getMemberId };
