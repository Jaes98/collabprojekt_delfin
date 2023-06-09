"use strict";

import { viewControl } from "./SPA.js";
import { updateMemberPUT, createdMember, deleteMember, getMembers } from "./REST.js";
import { refinedData, checkDiscipline, changeCreateCheckboxes, changeUpdateCheckboxes, dateChecker } from "./Helper-functions.js";
import { startKasserer } from "./kasserer.js";
import { startTrainer } from "./trainer.js";

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
  document.querySelector("#log-in-reset").addEventListener("click", () => viewControl("#front-page"));
  document.querySelector("#log-in-form").addEventListener("submit", logInAttempt);
  document.querySelector("#competetive").addEventListener("change", labelToGrey);

  document.querySelector("#member-search").addEventListener("keyup", searchBarChanged);
  document.querySelector("#member-search").addEventListener("search", searchBarChanged);

  document.querySelector("#formand-update-competetive").addEventListener("change", changeUpdateCheckboxes);
  document.querySelector("#competetive").addEventListener("change", changeCreateCheckboxes);

  getUpdatedFirebase();
}

function showMembersAll() {
  const listOfAll = listOfMembers;
  const sortedList = sortList(listOfAll);
  const searchedList = sortedList.filter((member) => member.name.toLowerCase().includes(valueToSearchBy));
  const filteredList = filterList(searchedList);
  if (filteredList.length === 0) {
    const noResultsHtml = /* html */ `<p>Ingen resultater fundet.</p>`;
    document.querySelector("#formand-table-body").innerHTML = noResultsHtml;
  } else showMembers(filteredList);
}

function showMembers(array) {
  console.log("showmembers array:", array);
  document.querySelector("#formand-table-body").innerHTML = "";

  for (const member of array) {
    showMember(member);
  }
}

function showMember(member) {
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
  let gender = "";
  if (member.gender === "male") gender = "Mand";
  else if (member.gender === "female") gender = "Kvinde";
  else if (member.gender === "other") gender = " Andet";

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

function memberOverview() {
  const countActive = listOfMembers.filter((member) => member.active === "Aktivt medlem");
  const countPassiv = listOfMembers.filter((member) => member.active === "Passivt medlem");
  const overview = document.querySelector("#overview");
  overview.innerHTML = "";
  overview.insertAdjacentHTML(
    "beforeend",
    /*HTML */ `
  <p><B>Antal medlemmer:</B> ${listOfMembers.length}</p>
  <p>Aktive medlemmer: ${countActive.length}</p>
  <p>Passive medlemmer: ${countPassiv.length}</p>
  `
  );
}

async function createNewMember(event) {
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
    breaststroke: form.breaststroke.checked,
    restance: false
  };

  const bdayCheck = dateChecker(newMember.bday);

  let disciplineCheck = true;
  if (newMember.competetive) {
    if (form.backCrawl.checked) disciplineCheck = true;
    else if (form.butterfly.checked) disciplineCheck = true;
    else if (form.breaststroke.checked) disciplineCheck = true;
    else if (form.crawl.checked) disciplineCheck = true;
    else disciplineCheck = false;
  }

  const errorMessage = document.querySelector("#create-member-error");
  console.log(newMember);

  if (disciplineCheck && bdayCheck) {
    const response = await createdMember(newMember);
    errorMessage.innerHTML = "";
    errorMessage.classList.remove("create-error");
    if (response.ok) getUpdatedFirebase();
  } else {
    errorMessage.classList.add("create-error");
    if (disciplineCheck === false) {
      errorMessage.innerHTML = "Konkurrencemedlemmer skal have mindst én disciplin";
    } else if (bdayCheck === false) {
      errorMessage.innerHTML = "Forkert fødselsdag. Brug formattet: åååå-mm-dd";
    } else errorMessage.innerHTML = "Weird fucking error bro";
  }
}

function updateMemberClicked(member) {
  const updateForm = document.querySelector("#formand-form-update-member2");
  document.querySelector("#show-member-modal").close();

  if (member.competetive === "Konkurrent") member.competetive = true;
  else member.competetive = false;

  if (member.active === "Aktivt medlem") member.active = true;
  else member.active = false;

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
  updateForm.restance.value = member.restance;

  updateForm.setAttribute("data-id", member.id);
  document.querySelector("#dialog-update-member2").showModal();
}

async function updateMember(event) {
  event.preventDefault();

  let form = event.target;
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
    restance: form.restance.value === "true"
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

async function getUpdatedFirebase(params) {
  const result = await getMembers();

  result.forEach(refinedData);
  listOfMembers = result;
  showMembersAll();
  memberOverview();

  startKasserer(result);
  startTrainer(result);
}

function sortList(listToSort) {
  if (valueToSortBy === "age") {
    return listToSort.sort((first, second) => first.age - second.age);
  } else {
    return listToSort.sort((member1, member2) => member1[valueToSortBy].localeCompare(member2[valueToSortBy]));
  }
}

let valueToSortBy = "name";
function setSort() {
  valueToSortBy = document.querySelector("#sort").value;
  showMembersAll();
}

let valueToSearchBy = "";
function searchBarChanged() {
  valueToSearchBy = document.querySelector("#member-search").value;

  showMembersAll();
}

let valueToFilterBy = "";
function chosenFilter() {
  valueToFilterBy = document.querySelector("#nav-filter").value;
  showMembersAll();
}

function filterList(searchedList) {
  if (valueToFilterBy === "") return searchedList;
  return searchedList.filter((member) => Object.values(member).includes(valueToFilterBy));
}

function logInAttempt(event) {
  event.preventDefault();
  console.log("logging");
  const form = event.target;
  console.log(form.brugernavn.value);
  if (form.brugernavn.value === "formand") viewControl("#formand");
  else if (form.brugernavn.value === "kasserer") viewControl("#kasserer");
  else if (form.brugernavn.value === "træner") viewControl("#trainer");
}

function labelToGrey() {
  const formCreate = document.querySelector("#form-create-member");
  if (formCreate.competetive.value === "false") {
    document.querySelectorAll(".greyIt").forEach((label) => label.classList.add("label-grey"));
  } else if (formCreate.competetive.value === "true") {
    document.querySelectorAll(".greyIt").forEach((label) => label.classList.remove("label-grey"));
  }
}

export { getUpdatedFirebase };
