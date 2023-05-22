"use strict";

window.addEventListener("load", viewControl);

function viewControl(newHash) {
  console.log(newHash);
  if (newHash === "#front-page" || newHash === "#kasserer") location.hash = newHash;
  window.addEventListener("hashchange", changeHash);
  changeHash();
}

function changeHash() {
  let currentPage = "#front-page";
  console.log("location.hash:", location.hash);
  console.log("currentPage:", currentPage);
  if (location.hash) {
    currentPage = location.hash;
  }
  changeNavBar();
  hideAllPages();

  document.querySelector(currentPage).classList.add("active");
  setActivePage(currentPage);
}
function changeNavBar(params) {
  if (location.hash === "#front-page" || location.hash === "#log-in") document.querySelectorAll(".nav-link").forEach((page) => page.classList.add("hidden"));
  else {
    console.log("elseeeee");
    document.querySelectorAll(".nav-link").forEach((page) => page.classList.remove("hidden"));
  }
}

function hideAllPages() {
  document.querySelectorAll(".page-view").forEach((page) => page.classList.remove("active"));
  document.querySelectorAll(".nav-link").forEach((page) => page.classList.remove("highlighted"));
}

function setActivePage(hashtag) {
  const activePage = document.querySelector(`a.nav-link[href="${hashtag}"]`);
  if (activePage) {
    activePage.classList.add("highlighted");
  }
}

export { viewControl };
