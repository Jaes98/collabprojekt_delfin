function showMemberKasserer(member) {
  

    const html = /* HTML */ `
      <tr class="member-item">
        <td>${member.name}</td>
        <td>${member.ageGroup}</td>
        <td>${member.active}</td>
        <td>${member.competetive}</td>
        <td>
          <button class="buttonAni" id="memberShowMore">Se mere</button>
        </td>
      </tr>
    `;
    document.querySelector("#formand-table-body").insertAdjacentHTML("beforeend", html);
    document.querySelector("#formand-table-body tr:last-child").addEventListener("click", () => showMemberModal(member));
  }

  function showMembersKasserer(array) {
    console.log("showmembers array:", array);
    document.querySelector("#formand-table-body").innerHTML = "";
  
    for (const member of array) {
      showMemberFormand(member);
    }
  }