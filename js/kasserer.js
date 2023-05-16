// import { getUpdatedFirebase } from "./script";

let listOfMembers;

function startKasserer(array) {
 // Kald alt mulight
 listOfMembers = array
 
 showMembersKasserer(array)
 kassererOverview()
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
    if (member.active === "Passivt medlem") ageGroup = "";
    else if (member.active === "Aktivt medlem") ageGroup = " : " + member.ageGroup;
  
    let restance = "";
    if (member.restance) restance = "Ja";
    else if (member.restance === false) restance = "Nej";
  
    const html = /* HTML */ `
      <tr class="member-item-kasserer">
        <td>${member.name}</td>
        <td>${member.active} ${ageGroup}</td>
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
    console.log("list of members:",listOfMembers);
  
    const juniorMembers = listOfMembers.filter((member) => member.ageGroup === "Junior");
    const seniorMembers = listOfMembers.filter((member) => member.ageGroup === "Senior");
    const seniorPlusMembers = listOfMembers.filter((member) => member.ageGroup=== "Senior+");
    const countActive = listOfMembers.filter((member) => member.active === "Aktivt medlem");
    const countPassive = listOfMembers.filter((member) => member.active === "Passivt medlem");
  
    const membersInRestance = listOfMembers.filter((member) => member.restance === true);
    const totalYearlyIncome = moneyCalculator(listOfMembers)
    const moneyInRestance = moneyCalculator(membersInRestance)
  
    function moneyCalculator(listOfMembersToCalculate) {
      let expectedIncome = 0
      const passiveRate = 500
      const juniorRate = 1000
      const seniorRate = 1600
      const seniorPlusDiscount = 0.75
  
      for (const member of listOfMembersToCalculate) {
        if (member.active === "Passivt medlem") {expectedIncome += passiveRate;}
        else if(member.ageGroup === "Senior") {expectedIncome += seniorRate; }
        else if(member.ageGroup === "Junior") {expectedIncome += juniorRate}
        else {expectedIncome += seniorRate*seniorPlusDiscount}
      }
      return expectedIncome
    }
  
    const income = document.querySelector("#kasserer-income")
    const memberInfo = document.querySelector("#kasserer-member-overview")
  
    memberInfo.insertAdjacentHTML("beforeend",`
    <p>Antal medlemmer: ${listOfMembers.length} </p>
    <p>Antal Junior-medlemmer: ${juniorMembers.length} </p>
    <p>Antal Senior-medlemmer: ${seniorMembers.length} </p>
    <p>Antal Senior+-medlemmer: ${seniorPlusMembers.length} </p>
    <p>Antal medlemmer i restance: ${membersInRestance.length} </p>
    <p>Aktive medlemmer: ${countActive.length}</p>
    <p>Passive medlemmer: ${countPassive.length}</p>
    `)
  
    income.insertAdjacentHTML("beforeend",`
    <p>Forventet årlig indkomst: ${totalYearlyIncome}</p>
    <p>Restancebeløb: ${moneyInRestance}</p>
    `)
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
    </article>
    `;
    document.querySelector("#show-member-modal-kasserer").innerHTML = html;
    document.querySelector("#show-member-modal-kasserer").showModal();
  
    document.querySelector("#btn-close-modal-kasserer").addEventListener("click", () => document.querySelector("#show-member-modal-kasserer").close());
  }

  function sortList(listToSort) {
    if (valueToSortBy === "age") {
      return listToSort.sort((first, second) => first.age - second.age);
    } else {
      return listToSort.sort((member1, member2) => member1[valueToSortBy].localeCompare(member2[valueToSortBy]));
    }
  }
  
  let valueToSortBy = "name";
  function setSort() {
  valueToSortBy = document.querySelector("#sort").value;
    showMembersAll();
  }
  
  let valueToSearchBy = "";
  function searchBarChanged() {
    valueToSearchBy = document.querySelector("#member-search").value;
  
    showMembersAll()
  }
  
  let valueToFilterBy = "";
  function chosenFilter() {
    valueToFilterBy = document.querySelector("#nav-filter").value;
    showMembersAll();
  }
  
  function filterList(searchedList) {
    if (valueToFilterBy === "") return searchedList;
    return searchedList.filter((member) => Object.values(member).includes(valueToFilterBy));
  }
  

  export {startKasserer}