


function showMembersTrainer(array) {
    console.log("showmembers array:", array);
    document.querySelector("#formand-table-body").innerHTML = "";
  
    for (const member of array) {
      showMemberFormand(member);
    }
  }