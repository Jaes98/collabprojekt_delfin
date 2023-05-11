"use strict";

const dolphinDatabase = "https://delfin-projekt-default-rtdb.europe-west1.firebasedatabase.app";

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
  const fetchedResults = await membersFromDatabase.json();

  // sætter members objekter ind i et array
  // const membersToArray = prepareData(fetchedMembers);
  // return membersToArray;

  // Busters note: Vi kan vel bare returne med det samme, vi bruger vist ikke memeberstoarray til andet?:
  return prepareData(fetchedResults);
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
    restSuccess();
  } else {
    console.error("member was NOT send to the database");
    restFail();
  }

  return response;
}

async function updateMemberPUT(memberToUpdate) {
  console.log(memberToUpdate.id);
  const objectToJSON = JSON.stringify(memberToUpdate);

  const response = await fetch(`${dolphinDatabase}/members/${id}`, {
    method: "PUT",
    body: objectToJSON,
  });

  return response;
}

function deleteMember() {}

function restSuccess() {}

function restFail() {}

export { updateMemberPUT, createdMember };
