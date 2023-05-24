import { getUpdatedFirebase } from "./script.js";

import { updateMemberPatch } from "./REST.js";

let listOfMembers;

function startKasserer(array) {
  // Kald alt mulight
  listOfMembers = array;

  // document.querySelector("#kasserer-update-button").addEventListener("click", () => document.querySelector("#kasserer-update-dialog").showModal());

  document.querySelector("#sort-kasserer").addEventListener("change", setSort);
  document.querySelector("#nav-filter-kasserer").addEventListener("change", chosenFilter);

  document.querySelector("#member-search-kasserer").addEventListener("keyup", searchBarChanged);
  document.querySelector("#member-search-kasserer").addEventListener("search", searchBarChanged);

  document.querySelector("#kasserer-update-cancel").addEventListener("click", () => document.querySelector("#kasserer-update-dialog").close());
  document.querySelector("#update-member-kasserer").addEventListener("submit", updateMemberKasserer);

  showMembersKasserer(array);
  kassererOverview();
}

function showMembersAll() {
  const listOfAll = listOfMembers;
  const sortedList = sortList(listOfAll);
  const searchedList = sortedList.filter((member) => member.name.toLowerCase().includes(valueToSearchBy));
  const filteredList = filterList(searchedList);
  if (filteredList.length === 0) {
    const noResultsHtml = /* html */ `<p>Ingen resultater fundet.</p>`;
    document.querySelector("#kasserer-table-body").innerHTML = noResultsHtml;
  } else showMembersKasserer(filteredList);
}

function showMembersKasserer(array) {
  console.log("showmembers array:", array);
  document.querySelector("#kasserer-table-body").innerHTML = "";

  for (const member of array) {
    showMemberKasserer(member);
  }
}

function showMemberKasserer(member) {
  let ageGroup = "";

  if (member.active === "Passivt medlem") member.paymentGroup = `Passiv ${member.ageGroup}`;
  else if (member.active === "Aktivt medlem") member.paymentGroup = `Aktiv ${member.ageGroup}`;

  // let restance = "";
  // if (member.restance) {
  //   restance = "Ja";
  //   document.querySelector("tr.member-item-kasserer").classList.add("btn-red")
  // }
  // else if (member.restance === false) restance = "Nej";
  let restance = "";
  let idRedness = "";

  if (member.restance) {
    restance = "Ja";
    idRedness = "back-red";
  } else if (member.restance === false) restance = "Nej";

  const html = /* html */ `
    <tr class="member-item-kasserer" id="${idRedness}">
      <td>${member.name}</td>
      <td>${member.paymentGroup}</td>
      <td>${restance}</td>
      <td>
        <button class="buttonAni" id="memberShowMore-kasserer">Se mere</button>
      </td>
    </tr>
  `;
  document.querySelector("#kasserer-table-body").insertAdjacentHTML("beforeend", html);
  document.querySelector("#kasserer-table-body tr:last-child").addEventListener("click", () => showMemberModalKasserer(member));
}

function kassererOverview(params) {
  console.log("list of members:", listOfMembers);

  const juniorMembers = listOfMembers.filter((member) => member.ageGroup === "Junior");
  const seniorMembers = listOfMembers.filter((member) => member.ageGroup === "Senior");
  const seniorPlusMembers = listOfMembers.filter((member) => member.ageGroup === "Senior+");
  const countActive = listOfMembers.filter((member) => member.active === "Aktivt medlem");
  const countPassive = listOfMembers.filter((member) => member.active === "Passivt medlem");

  const membersInRestance = listOfMembers.filter((member) => member.restance === true);
  const totalYearlyIncome = moneyCalculator(listOfMembers);
  const moneyInRestance = moneyCalculator(membersInRestance);

  function moneyCalculator(listOfMembersToCalculate) {
    let expectedIncome = 0;
    const passiveRate = 500;
    const juniorRate = 1000;
    const seniorRate = 1600;
    const seniorPlusDiscount = 0.75;

    for (const member of listOfMembersToCalculate) {
      if (member.active === "Passivt medlem") {
        expectedIncome += passiveRate;
      } else if (member.ageGroup === "Senior") {
        expectedIncome += seniorRate;
      } else if (member.ageGroup === "Junior") {
        expectedIncome += juniorRate;
      } else {
        expectedIncome += seniorRate * seniorPlusDiscount;
      }
    }
    return expectedIncome;
  }

  const income = document.querySelector("#kasserer-income");
  const memberInfo = document.querySelector("#kasserer-member-overview");

  income.innerHTML = "";
  memberInfo.innerHTML = "";

  memberInfo.insertAdjacentHTML(
    "beforeend",
    /*html*/ `
    <p><b>Medlemmer i restance:</b> ${membersInRestance.length} </p>
    <hr>
    <p><b>Antal medlemmer:</b> ${listOfMembers.length} </p>
    <p>Aktive medlemmer: ${countActive.length}</p>
    <p>Passive medlemmer: ${countPassive.length}</p>
    <p>Junior: ${juniorMembers.length} </p>
    <p>Senior: ${seniorMembers.length} </p>
    <p>Senior+: ${seniorPlusMembers.length} </p>
    `
  );

  income.insertAdjacentHTML(
    "beforeend",
    /*html*/ `
    <p><b>Forventet årlig indkomst:</b></p>
    <p id="income"><b>${totalYearlyIncome}</b> kr.</p>
    <p><b>Restancebeløb:</b></p>
    <p id="restanceRedText"><b>${moneyInRestance}</b> kr.</p>
    `
  );
}

function showMemberModalKasserer(member) {
  let gender = "";
  if (member.gender === "male") gender = "Mand";
  else if (member.gender === "female") gender = "Kvinde";

  let restance = "";
  if (member.restance) restance = "Ja";
  else if (member.restance === false) restance = "Nej";

  const html = /*HTML*/ `
    <article class="modal-item">
      <h3>${member.name}
        <button id="btn-close-modal-kasserer" class="buttonAni">Tilbage</button>
      </h3>
      <section id="member-modal-section-kasserer">
        <p>Alder: ${member.age} år</p>
        <p>Tlf: ${member.phonenumber}</p>
        <p>Email: ${member.email}</p>
        <p>Adresse: ${member.adress}</p>
        <p>Køn: ${gender}</p>
        <hr>
        <h4>Medlemskabsoplysninger:</h4>
        <p>Aldersgruppe: ${member.ageGroup}</p>
        <p>Aktivitetsstatus: ${member.active}</p>
        <p>Er medlem i restance: ${restance}</p>
      </section>
      <button id="kasserer-update-button" class="buttonAni">Opdater medlem her</button> 
    </article>
    `;
  document.querySelector("#show-member-modal-kasserer").innerHTML = html;
  document.querySelector("#show-member-modal-kasserer").showModal();

  document.querySelector("#kasserer-update-button").addEventListener("click", () => updateMemberKassererClicked(member));

  document.querySelector("#btn-close-modal-kasserer").addEventListener("click", () => document.querySelector("#show-member-modal-kasserer").close());
}

function updateMemberKassererClicked(member) {
  document.querySelector("#show-member-modal-kasserer").close();
  const updateForm = document.querySelector("#update-member-kasserer");

  if (member.active === "Aktivt medlem") member.active = true;
  else if ((member.active = "Passivt medlem")) member.active = false;

  updateForm.active.value = member.active;
  updateForm.restance.value = member.restance;

  updateForm.setAttribute("data-id", member.id);

  console.log("updateClicked", updateForm.restance.value);

  document.querySelector("#kasserer-update-dialog").showModal();
}

async function updateMemberKasserer(event) {
  event.preventDefault();

  const updatedMember = {
    active: event.target.active.value === "true",
    restance: event.target.restance.value === "true"
  };

  console.log("updated", event.target.restance.value);
  const id = event.target.getAttribute("data-id");
  const response = await updateMemberPatch(updatedMember, id);
  if (response.ok) {
    getUpdatedFirebase();
  }
  document.querySelector("#kasserer-update-dialog").close();
}

function sortList(listToSort) {
  if (valueToSortBy === "restance") {
    return listToSort.sort((member1, member2) => {
      if (member1.restance === undefined) member1.restance = false;
      if (member2.restance === undefined) member2.restance = false;
      return member1.restance - member2.restance;
    });
  } else {
    return listToSort.sort((member1, member2) => member1[valueToSortBy].localeCompare(member2[valueToSortBy]));
  }
}

let valueToSortBy = "name";
function setSort() {
  valueToSortBy = document.querySelector("#sort-kasserer").value;
  showMembersAll();
}

let valueToSearchBy = "";
function searchBarChanged() {
  valueToSearchBy = document.querySelector("#member-search-kasserer").value;

  showMembersAll();
}

let valueToFilterBy = "";
function chosenFilter() {
  valueToFilterBy = document.querySelector("#nav-filter-kasserer").value;
  showMembersAll();
}

function filterList(searchedList) {
  if (valueToFilterBy === "") return searchedList;
  if (valueToFilterBy === "Passiv") return searchedList.filter((member) => member.active.includes(valueToFilterBy));
  else return searchedList.filter((member) => member.paymentGroup === valueToFilterBy);
}

export { startKasserer };
