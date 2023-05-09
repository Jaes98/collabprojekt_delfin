"use strict";

window.addEventListener("load", viewControl);

function viewControl() {
  window.addEventListener("hashchange", changeHash);
  changeHash();
}

function changeHash() {
  let currentPage = "#abc1";

  if (location.hash) {
    currentPage = location.hash;
  }

  hideAllPages();
  document.querySelector(currentPage).classList.add("active");
  setActivePage(currentPage);
}

function hideAllPages() {
  document.querySelectorAll(".link-content").forEach((page) => page.classList.remove("active"));
  document.querySelectorAll(".nav-link").forEach((page) => page.classList.remove("highlighted"));
}

function setActivePage(hashtag) {
  const activePage = document.querySelector(`a.nav-link[href="${hashtag}"]`);
  if (activePage) {
    activePage.classList.add("highlighted");
  }
}

export { viewControl };