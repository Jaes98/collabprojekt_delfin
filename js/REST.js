"use strict";

const dolphinDatabase = "https://delfin-projekt-default-rtdb.europe-west1.firebasedatabase.app";

async function getData() {
  // henter data og omdanner til objekter
  const membersFromDatabase = await fetch(`${dolphinDatabase} / members.json`);
  const fetchedMembers = await membersFromDatabase.json();

  // sætter members objekter ind i et array
  const membersToArray = prepareData(fetchedMembers);

  return membersToArray;
}

function prepareData() {}

async function createNewMember(newMember) {
  const newMember = {
    name,
    bday,
    phonenumber,
    adress,
    gender,
    email,
    active,
    competetive,
    crawl,
    butterfly,
    backCrawl,
    breaststroke,
    trid,
  };

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

function updateMember() {}

function deleteMember() {}

function restSuccess() {}

function restFail() {}
