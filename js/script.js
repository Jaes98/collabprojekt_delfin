"use strict";

import { viewControl } from "./SPA.js";

window.addEventListener("load", start);

function start() {
  console.log("start:");
  viewControl();


  document.querySelector("#formand-update-button").addEventListener("click",()=>document.querySelector("#formand-update-dialog").showModal())
  document.querySelector("#formand-update-form").addEventListener("submit",updateMember)
}

function showMembers() {}

function showMember() {}


function updateMember(event) {
  event.preventDefault()
  console.log(event)

  const value = event.target.value
  console.log(value)
}