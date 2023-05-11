"use strict";

import { viewControl } from "./SPA.js";
import { updateMemberPUT, createdMember, deleteMember } from "./REST.js";

window.addEventListener("load", start);

function start() {
  console.log("start:");
  viewControl();

  document.querySelector("#btn-formand-create").addEventListener("click", () => document.querySelector("#dialog-create-member").showModal());
  document.querySelector("#form-create-member").addEventListener("submit", createNewMember);
  document.querySelector("#btn-no-create").addEventListener("click", () => document.querySelector("#dialog-create-member").close());
  document.querySelector("#formand-update-button").addEventListener("click", updateMemberClicked);
  document.querySelector("#formand-update-form").addEventListener("submit", updateMember);
  document.querySelector("#form-delete-member").addEventListener("submit", deleteMemberYes);
  document.querySelector("#btn-no-delete").addEventListener("click", () => document.querySelector("#dialog-delete-member").close());
}

function showMembers(array) {
  document.querySelector(".member-container").innerHTML = "";

  for (const member of array) {
    showMember(member);
  }
}

function showMember(member) {
  const html = /* HTML */ `
    <tr class="member-item">
      <td>${member.name}</td>
      <td>${member.bday}</td>
      <td>${member.active}</td>
      <td>${member.competetive}</td>
      <button class="buttonAni" id="memberShowMore">Se mere</button>
    </tr>
  `;
  document.querySelector("#formand-table-body").insertAdjacentHTML(beforeend, html);
  document.querySelector("#formand-table-body tr:last-child").addEventListener("click", () => showMemberModal(member));
}

function showMemberModal(member) {
  const html = /*HTML*/ `
  <article class="modal-item">
  <h3>${member.name} 
  <button id="btn-close-modal" class="buttonAni">Tilbage</button>
  </h3>
  <p>${member.bday}</p>
  <p>${member.phonenumber}</p>
  <p>${member.email}</p>
  <p>${member.adress}</p>
  <p>${member.gender}</p>
  <hr>
  <h4>Medlemskabs oplysninger:</h4>
  <p>${member.active}</p>
  <p>${member.competetive}</p>
  <div>
  <button id="btn-delete-member" class="buttonAni">Slet medlem</button>
  <button id="btn-update-member" class="buttonAni">Opdatér medlem</button>
  </div>
  </article>
  `;
  document.querySelector("#btn-close-modal").addEventListener("click", () => document.querySelector("#show-member-modal").close());
  document.querySelector("#btn-update-member").addEventListener("click", () => updateMemberClicked(member));
  document.querySelector("#btn-delete-member").addEventListener("click", () => deleteClickedOpenModal(member));

  document.querySelector("#show-member-modal").innerHTML = html;
  document.querySelector("#show-member-modal").showModal();
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
    active: form.active.value,
    competetive: form.competetive.value,
    crawl: form.crawl.value,
    butterfly: form.butterfly.value,
    backCrawl: form.backCrawl.value,
    breastStroke: form.breaststroke.value,
  };
  console.log(newMember);
  createdMember(newMember);
}

function updateMemberClicked(params) {
  const updateForm = document.querySelector("#formand-update-dialog");

  // updateForm.name.value = member.name;
  // updateForm.bday.value = member.bday;
  // updateForm.phone.value = member.phone;
  // updateForm.email.value = member.email;
  // updateForm.adress.value = member.adress;
  // updateForm.gender.value = member.gender;
  // updateForm.activity.value = member.activity;
  // updateForm.comp.value = member.comp;
  // updateForm.crawl.value = member.crawl;
  // updateForm.butterfly.value = member.butterfly;
  // updateForm.backCrawl.value = member.backCrawl;
  // updateForm.breastStroke.value = member.breastStroke;
  // updateForm.setAttribute("data-id", member.id);
  document.querySelector("#formand-update-dialog").showModal();
}

function updateMember(event) {
  event.preventDefault();
  console.log(event);

  // const form = event.target
  let form = event.target;
  console.log(form.name.value);
  const name1 = form.name.value;

  const updatedMember = {
    name: form.name.value,
    bday: form.bday.value,
    phone: form.phone.value,
    email: form.email.value,
    adress: form.adress.value,
    gender: form.gender.value,
    activity: form.activity.value,
    comp: form.comp.value,
    crawl: form.crawl.value,
    butterfly: form.butterfly.value,
    backCrawl: form.backCrawl.value,
    breastStroke: form.breastStroke.value,
  };
  console.log("updatedmember", updatedMember);

  // updateMemberPUT(updatedMember)
  document.querySelector("#formand-update-dialog").close();
}

function deleteClickedOpenModal(member) {
  document.querySelector("#dialog-delete-member-name").textContent = member.name;
  document.querySelector("#form-delete-member").setAttribute("data-id", member.id);
  // Måske skal vi bruge en close ? document.querySelector("#show-xxx-xxx").close();
  document.querySelector("#dialog-delete-member").showModal();
}

async function deleteMemberYes(event) {
  const id = event.target.getAttribute("data-id");
  const response = await deletePost(id);
  console.log("!Deletion!");
  if (response.ok) {
    console.log(`svømmer ${id} slettet`);
    // indsæt "getUpdatedFirebase" tilsvarende funktion
  }
}
