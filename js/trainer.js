// import { getUpdatedFirebase } from "./script";

function startTrainer(params) {
    // Starter alt med trainer
    topFiveCrawl();
    topFiveBreaststroke();
    topFiveButterfly();
    topFiveBackcrawl();
}

const topFiveMembers = [];

for (const disciplines of listOfMembers) {
  
}

function showMembersTrainer(array) {
    console.log("showmembers array:", array);
    document.querySelector("#formand-table-body").innerHTML = "";
  
    for (const member of array) {
      showMemberFormand(member);
    }
  }

function topFiveCrawl() {
  console.log("topFiveDisciplines IGANG DU");

  const crawl = document.querySelector("#topfive-crawl-table-body");

  crawl.insertAdjacentHTML(
    "beforeend",

  )
}
function topFiveBackcrawl() {
  console.log("topFiveBackcrawl IGANG DU");

  const backcrawl = document.querySelector("#topfive-backcrawl-table-body");

  backcrawl.insertAdjacentHTML(
    "beforeend",

    );
}
function topFiveButterfly() {
  console.log("topFiveButterfly IGANG DU");

  const butterfly = document.querySelector("#topfive-butterfly-table-body");

  butterfly.insertAdjacentHTML("beforeend");
}
function topFiveBreaststroke() {
  console.log("topFiveBreaststroke IGANG DU");

  const breaststroke = document.querySelector(
    "#topfive-breaststroke-table-body"
  );

  breaststroke.insertAdjacentHTML(
    "beforeend", 

    );
}

  export {startTrainer}