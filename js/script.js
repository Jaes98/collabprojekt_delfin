"use strict";

import { viewControl } from "./SPA.js";
import { updateMemberPUT, createdMember, deleteMember, getMembers } from "./REST.js";
import { ageCalculator, ageToGroup, checkDiscipline } from "./Helper-functions.js";

window.addEventListener("load", start);

function start() {
  console.log("start:");
  viewControl();

  document.querySelector("#btn-formand-create").addEventListener("click", () => document.querySelector("#dialog-create-member").showModal());
  document.querySelector("#form-create-member").addEventListener("submit", createNewMember);
  document.querySelector("#btn-no-create").addEventListener("click", () => document.querySelector("#dialog-create-member").close());
  document.querySelector("#formand-update-button").addEventListener("click", updateMemberClicked);
  document.querySelector("#formand-form-update-member2").addEventListener("submit", updateMember);
  document.querySelector("#form-delete-member").addEventListener("submit", deleteMemberYes);
  document.querySelector("#btn-no-delete").addEventListener("click", () => document.querySelector("#dialog-delete-member").close());

  getUpdatedFirebase();
}

function showMembers(array) {
  document.querySelector(".member-container").innerHTML = "";

  for (const member of array) {
    showMember(member);
  }
}

function showMember(member) {
  const ageInYears = ageCalculator(member.bday);
  const ageGroup = ageToGroup(ageInYears);
  const html = /* HTML */ `
    <tr class="member-item">
      <td>${member.name}</td>
      <td>${ageGroup}</td>
      <td>${member.active}</td>
      <td>${member.competetive}</td>
      <td>
        <button class="buttonAni" id="memberShowMore">Se mere</button>
      </td>
    </tr>
  `;
  document.querySelector("#formand-table-body").insertAdjacentHTML("beforeend", html);
  document.querySelector("#formand-table-body tr:last-child").addEventListener("click", () => showMemberModal(member, ageGroup, ageInYears));
}

function showMemberModal(member, ageGroup, ageInYears) {
  // console.log(member.crawl);
  const disciplines = checkDiscipline(member);
  const html = /*HTML*/ `
  <article class="modal-item">
  <h3>${member.name} 
  <button id="btn-close-modal" class="buttonAni">Tilbage</button>
  </h3>
  <section id="member-modal-section">
  <p>Alder: ${ageInYears} år</p>
  <p>Tlf: ${member.phonenumber}</p>
  <p>Email: ${member.email}</p>
  <p>Adresse: ${member.adress}</p>
  <p>Køn: ${member.gender}</p>
  <hr>
  <h4>Medlemskabsoplysninger:</h4>
  <p>Aldersgruppe: ${ageGroup}</p>
  <p>Aktivitetsstatus: ${member.active}</p>
  <p>Aktivitetsgruppe: ${member.competetive}</p>
  <p>Træner: ${member.trid}</p>
  </section>
  
  

  <div>
  <button id="btn-delete-member" class="buttonAni">Slet medlem</button>
  <button id="btn-update-member" class="buttonAni">Opdatér medlem</button>
  </div>
  </article>
  `;
  document.querySelector("#show-member-modal").innerHTML = html;

  if (member.competetive) {
    document.querySelector("#member-modal-section").insertAdjacentHTML(
      "beforeend",
      `
       <h4>Disciplin(er):</h4>
       <p>${disciplines.join(", ")}</p>
       `
    );
  }

  document.querySelector("#show-member-modal").showModal();

  document.querySelector("#btn-close-modal").addEventListener("click", () => document.querySelector("#show-member-modal").close());
  document.querySelector("#btn-update-member").addEventListener("click", () => updateMemberClicked(member));
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
}

function updateMemberClicked(params) {
  const updateForm = document.querySelector("#dialog-update-member2");

  // updateForm.name.value = member.name;
  // updateForm.bday.value = member.bday;
  // updateForm.phone.value = member.phonenumber;
  // updateForm.email.value = member.email;
  // updateForm.adress.value = member.adress;
  // updateForm.gender.value = member.gender;
  // updateForm.activity.value = member.activity;
  // updateForm.comp.value = member.comp;
  // updateForm.crawl.value = member.crawl;
  // updateForm.butterfly.value = member.butterfly;
  // updateForm.backCrawl.value = member.backCrawl;
  // updateForm.breaststroke.value = member.breaststroke;
  // updateForm.setAttribute("data-id", member.id);
  document.querySelector("#dialog-update-member2").showModal();
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
    phonenumber: form.phonenumber.value,
    email: form.email.value,
    adress: form.adress.value,
    gender: form.gender.value,
    activity: form.active.value === "true",
    comp: form.competetive.value === "true",
    crawl: form.crawl.checked,
    butterfly: form.butterfly.checked,
    backCrawl: form.backCrawl.checked,
    breaststroke: form.breaststroke.checked,
  };
  console.log("updatedmember", updatedMember);

  // updateMemberPUT(updatedMember)
  document.querySelector("#dialog-update-member2").close();
}

function deleteClickedOpenModal(member) {
  document.querySelector("#dialog-delete-member-name").textContent = member.name;
  document.querySelector("#form-delete-member").setAttribute("data-id", member.id);
  // Måske skal vi bruge en close ? document.querySelector("#show-xxx-xxx").close();
  document.querySelector("#dialog-delete-member").showModal();
}

async function deleteMemberYes(event) {
  const id = event.target.getAttribute("data-id");
  const response = await deleteMember(id);
  console.log("!Deletion!");
  if (response.ok) {
    console.log(`svømmer ${id} slettet`);
    // indsæt "getUpdatedFirebase" tilsvarende funktion
  }
}

async function getUpdatedFirebase(params) {
  const result = await getMembers();

  showMembers(result);
}
