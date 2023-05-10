"use strict";

import { viewControl } from "./SPA.js";
import { updateMemberPUT } from "./REST.js";

window.addEventListener("load", start);

function start() {
  console.log("start:");
  viewControl();

  document.querySelector("#formand-update-button").addEventListener("click", updateMemberClicked);
  document.querySelector("#formand-update-form").addEventListener("submit", updateMember);
}

function showMembers() {}

function showMember() {}

function updateMemberClicked(params) {
  const updateForm = document.querySelector("#formand-update-dialog")

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
    document.querySelector("#formand-update-dialog").showModal()
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
    breastStroke: form.breastStroke.value
  };
  console.log("updatedmember", updatedMember);

  // updateMemberPUT(updatedMember)
   document.querySelector("#formand-update-dialog").close();
}
