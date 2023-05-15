"use strict";

import { viewControl } from "./SPA.js";
import { updateMemberPUT, createdMember, deleteMember, getMembers } from "./REST.js";
import { ageCalculator, ageToGroup, checkDiscipline, checkCompetitorOrExerciser, checkMembership, addCoach, changeCreateCheckboxes, changeUpdateCheckboxes } from "./Helper-functions.js";

window.addEventListener("load", start);

let listOfMembers;

function start() {
  console.log("start:");
  viewControl();

  document.querySelector("#btn-formand-create").addEventListener("click", () => document.querySelector("#dialog-create-member").showModal());
  document.querySelector("#form-create-member").addEventListener("submit", createNewMember);
  document.querySelector("#btn-no-create").addEventListener("click", () => document.querySelector("#dialog-create-member").close());
  document.querySelector("#formand-form-update-member2").addEventListener("submit", updateMember);
  document.querySelector("#form-delete-member").addEventListener("submit", deleteMemberYes);
  document.querySelector("#btn-no-delete").addEventListener("click", () => document.querySelector("#dialog-delete-member").close());
  document.querySelector("#btn-formand-no-update").addEventListener("click", () => document.querySelector("#dialog-update-member2").close());
  document.querySelector("#sort").addEventListener("change", setSort);
  document.querySelector("#nav-filter").addEventListener("change", chosenFilter);

  document.querySelector("#member-search").addEventListener("keyup", searchBarChanged);
  document.querySelector("#member-search").addEventListener("search", searchBarChanged);

  document.querySelector("#formand-update-competetive").addEventListener("change", changeUpdateCheckboxes);
  document.querySelector("#competetive").addEventListener("change", changeCreateCheckboxes);

  getUpdatedFirebase();
}

function showMembersAll() {
  const listOfAll = listOfMembers;
  const sortedList = sortList(listOfAll);
  const searchedList = searchList(sortedList);
  const filteredList = filterList(searchedList);

  showMembers(filteredList);
}

function showMembers(array) {
  console.log("showmembers array:", array);
  document.querySelector("#formand-table-body").innerHTML = "";

  for (const member of array) {
    showMember(member);
  }
}

function showMember(member) {
  console.log(member.trid);

  const html = /* HTML */ `
    <tr class="member-item">
      <td>${member.name}</td>
      <td>${member.ageGroup}</td>
      <td>${member.active}</td>
      <td>${member.competetive}</td>
      <td>
        <button class="buttonAni" id="memberShowMore">Se mere</button>
      </td>
    </tr>
  `;
  document.querySelector("#formand-table-body").insertAdjacentHTML("beforeend", html);
  document.querySelector("#formand-table-body tr:last-child").addEventListener("click", () => showMemberModal(member));
}

function showMemberModal(member) {
  // console.log(member.crawl);
  let gender = "";
  if (member.gender === "male") gender = "Mand";
  else if (member.gender === "female") gender = "Kvinde";

  const disciplines = checkDiscipline(member);
  const html = /*HTML*/ `
  <article class="modal-item">
  <h3>${member.name} 
  <button id="btn-close-modal" class="buttonAni">Tilbage</button>
  </h3>
  <section id="member-modal-section">
  <p>Alder: ${member.age} år</p>
  <p>Tlf: ${member.phonenumber}</p>
  <p>Email: ${member.email}</p>
  <p>Adresse: ${member.adress}</p>
  <p>Køn: ${gender}</p>
  <hr>
  <h4>Medlemskabsoplysninger:</h4>
  <p>Aldersgruppe: ${member.ageGroup}</p>
  <p>Aktivitetsstatus: ${member.active}</p>
  <p>Aktivitetsgruppe: ${member.competetive}</p>
  </section>
  
  

  <div>
  <button id="btn-update-member" class="buttonAni">Opdatér medlem</button>
  <button id="btn-delete-member" class="buttonAni">Slet medlem</button>
  </div>
  </article>
  `;
  document.querySelector("#show-member-modal").innerHTML = html;

  console.log("comp:", member.competetive);
  if (member.competetive === "Konkurrent") {
    document.querySelector("#member-modal-section").insertAdjacentHTML(
      "beforeend",
      `
      <p>Træner: ${member.trid}</p>
       <h4>Disciplin(er):</h4>
       <p>${disciplines.join(", ")}</p>
       `
    );
  }

  document.querySelector("#show-member-modal").showModal();

  document.querySelector("#btn-close-modal").addEventListener("click", () => document.querySelector("#show-member-modal").close());
  document.querySelector("#btn-update-member").addEventListener("click", () => {
    updateMemberClicked(member);
    changeUpdateCheckboxes();
  });
  document.querySelector("#btn-delete-member").addEventListener("click", () => deleteClickedOpenModal(member));
}

function createNewMember(event) {
  console.log("createNewMember");
  event.preventDefault();
  let form = event.target;

  const newMember = {
    name: form.name.value,
    bday: form.bday.value,
    phonenumber: form.phonenumber.value,
    email: form.email.value,
    adress: form.adress.value,
    gender: form.gender.value,
    active: form.active.value === "true",
    competetive: form.competetive.value === "true",
    crawl: form.crawl.checked,
    butterfly: form.butterfly.checked,
    backCrawl: form.backCrawl.checked,
    breastStroke: form.breaststroke.checked,
    // coach: form.trid.value,
  };
  console.log(newMember);
  createdMember(newMember);
  getUpdatedFirebase();
}

function updateMemberClicked(member) {
  const updateForm = document.querySelector("#formand-form-update-member2");
  document.querySelector("#show-member-modal").close();

  console.log("active:", member.active);
  console.log("comp:", member.competetive);
  console.log("comp:", member.gender);
  if (member.competetive === "Konkurrent") member.competetive = "true";
  else member.competetive = "false";

  if (member.active === "Aktiv") member.active = "true";
  else member.active = "false";
  console.log("active:", member.active);
  console.log("comp:", member.competetive);

  updateForm.name.value = member.name;
  updateForm.bday.value = member.bday;
  updateForm.phonenumber.value = member.phonenumber;
  updateForm.email.value = member.email;
  updateForm.adress.value = member.adress;
  updateForm.gender.value = member.gender;
  updateForm.active.value = member.active;
  updateForm.competetive.value = member.competetive;
  updateForm.crawl.checked = member.crawl;
  updateForm.butterfly.checked = member.butterfly;
  updateForm.backCrawl.checked = member.backCrawl;
  updateForm.breaststroke.checked = member.breaststroke;
  console.log(member.id);
  updateForm.setAttribute("data-id", member.id);
  document.querySelector("#dialog-update-member2").showModal();
}

async function updateMember(event) {
  event.preventDefault();
  console.log(event);

  // const form = event.target
  let form = event.target;
  console.log(form.name.value);
  const name1 = form.name.value;
  console.log("competeteive:", form.competetive.value);
  console.log("crawl:", form.crawl.value);
  console.log("butterfly:", form.butterfly.value);

  const updatedMember = {
    name: form.name.value,
    bday: form.bday.value,
    phonenumber: form.phonenumber.value,
    email: form.email.value,
    adress: form.adress.value,
    gender: form.gender.value,
    active: form.active.value === "true",
    competetive: form.competetive.value === "true",
    crawl: form.crawl.checked,
    butterfly: form.butterfly.checked,
    backCrawl: form.backCrawl.checked,
    breaststroke: form.breaststroke.checked,
  };

  const id = form.getAttribute("data-id");
  const response = await updateMemberPUT(updatedMember, id);
  if (response.ok) {
    getUpdatedFirebase();
  }
  document.querySelector("#dialog-update-member2").close();
}

function deleteClickedOpenModal(member) {
  document.querySelector("#dialog-delete-member-name").textContent = member.name;
  document.querySelector("#form-delete-member").setAttribute("data-id", member.id);

  document.querySelector("#dialog-delete-member").showModal();
}

async function deleteMemberYes(event) {
  document.querySelector("#show-member-modal").close();

  const id = event.target.getAttribute("data-id");
  const response = await deleteMember(id);
  console.log("!Deletion!");
  if (response.ok) {
    console.log(`svømmer ${id} slettet`);
    document.querySelector("#dialog-delete-member");
    getUpdatedFirebase();
  }
}

let valueToSortBy = "";
function setSort() {
  valueToSortBy = document.querySelector("#sort").value;

  showMembersAll();
}

function sortList(listToSort) {
  console.log(listToSort);
  // Sorts the array based on the whether the sort value is a string, number or empty and displays the array through showMembers
  if (valueToSortBy === "age") {
    return listToSort.sort(compareNumber);
  } else if (valueToSortBy === "default") {
    return listToSort.sort(compareName);
  } else {
    return listToSort.sort(compareString);
  }

  function compareString(member1, member2) {
    return member1[valueToSortBy].localeCompare(member2[valueToSortBy]);
  }

  function compareNumber(member1, member2) {
    let first = member1.age;
    let second = member2.age;
    if (first === "Unknown") {
      first = 99999999;
    } else if (second === "Unknown") {
      second = 99999999;
    }
    return first - second;
  }
  function compareName(member1, member2) {
    return member1["name"].localeCompare(member2["name"]);
  }
}

async function getUpdatedFirebase(params) {
  const result = await getMembers();
  result.forEach(refinedData);
  showMembers(result);
  listOfMembers = result;
}

function refinedData(result) {
  ageCalculator(result);

  ageToGroup(result);

  addCoach(result);

  checkCompetitorOrExerciser(result);

  checkMembership(result);

  return result;
}

let valueToSearchBy = "";
function searchBarChanged() {
  valueToSearchBy = document.querySelector("#member-search").value;

  searchList(listOfMembers);
}

function searchList(sortedList) {
  console.log("searchlist, valuetosortby:", valueToSearchBy);
  console.log(sortedList.filter(member => member.name.toLowerCase().includes(valueToSearchBy)));
  const searchedList = sortedList.filter(member => member.name.toLowerCase().includes(valueToSearchBy));
  showMembers(searchedList);
  return sortedList.filter((member) => member.name.toLowerCase().includes(valueToSearchBy));
}

function changeCreateCheckboxes() {
  const createBoxes = document.querySelectorAll(".create-discipline");
  createBoxes.forEach((box) => {
    box.checked = false;
    box.disabled = !box.disabled;
  });
}

function changeUpdateCheckboxes() {
  const updateValue = document.querySelector("#formand-update-competetive").value === "true";
  const updateBoxes = document.querySelectorAll(".update-discipline");
  updateBoxes.forEach((box) => {
    box.disabled = !updateValue;
  });
}

let valueToFilterBy = "";
function chosenFilter() {
  valueToFilterBy = document.querySelector("#nav-filter").value;

  filterList(posts);
}

function filterList(searchedList) {
  console.log("serachedlist:", searchedList);
  const filteredList = searchedList;
  searchedList.filter();
}
