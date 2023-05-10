"use strict";

import { viewControl } from "./SPA.js";

window.addEventListener("load", start);

function start() {
  console.log("start:");
  viewControl();
}

function showMembers(array) {
  document.querySelector(".member-container").innerHTML="";
  
  for (const member of array) {
    showMember(member);
  }
  

}

function showMember(member) {
  const html = /* HTML */ `
  <article class="member-item">
  <h3>${member.name}</h3>
  <p>Alder: ${member.bday}</p>
  <p>Tlf. Nummer: ${member.phonenumber}</p>
  <p>Adress: ${member.adress} </p>
  <p>Køn: ${member.gender}</p>
  <p>Email: ${member.email}</p>
  <p>Aktiv: ${member.active}</p>
  <p>Konkurrence/motionist: ${member.competetive}</p>
  <p>Trænere-id: ${member.trid} </p>
  `

}
