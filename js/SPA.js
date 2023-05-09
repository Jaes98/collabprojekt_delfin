"use strict";

window.addEventListener("load", start);

function start(params) {
  window.addEventListener("hashchange", changeHash);
  changeHash();
}

function changeHash(event) {
  let currentPage = "#abc1";

  if (location.hash) {
    currentPage = location.hash;
  }

  hideAllPages();
  //   document.querySelector(currentPage).classList.remove("hidden");
  document.querySelector(currentPage).classList.add("active");
  setActivePage(currentPage);
}

function hideAllPages(params) {
  document.querySelectorAll(".link-content").forEach((page) => page.classList.remove("active"));
}

function setActivePage(hashtag) {
  console.log(hashtag);
  const activePage = document.querySelector(`a.nav-link[href="${hashtag}"]`);
  console.log(activePage);
  activePage.classList.remove("hidden");
}
