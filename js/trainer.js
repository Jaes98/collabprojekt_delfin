// import { getUpdatedFirebase } from "./script";

function startTrainer(params) {
    // Starter alt med trainer
}

function showMembersTrainer(array) {
    console.log("showmembers array:", array);
    document.querySelector("#formand-table-body").innerHTML = "";
  
    for (const member of array) {
      showMemberFormand(member);
    }
  }

  export {startTrainer}