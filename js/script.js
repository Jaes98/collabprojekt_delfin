"use strict";

import { viewControl } from "./SPA.js";

window.addEventListener("load", start);

function start() {
  console.log("start:");
  viewControl();
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
  document.querySelector("#show-member-modal").innerHTML = html;
  document.querySelector("#show-member-modal").showModal();
}
