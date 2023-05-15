function ageCalculator(member) {
  const birthday = new Date(member.bday);
  const today = new Date();
  const ageInMilis = today - birthday;
  const miliSecondsInAYear = 1000 * 60 * 60 * 24 * 365;
  member.age = Math.floor(ageInMilis / miliSecondsInAYear);
}

function ageToGroup(member) {
  if (member.age < 18) {
    member.ageGroup = "Junior";
  } else if (member.age < 60) {
    member.ageGroup = "Senior";
  } else {
    member.ageGroup = "Senior+";
  }
}

function checkDiscipline(member) {
  let listOfDisciplines = [];
  if (member.crawl) {
    listOfDisciplines.push("Crawl");
  }
  if (member.backCrawl) {
    listOfDisciplines.push("Rygcrawl");
  }
  if (member.breaststroke) {
    listOfDisciplines.push("Brystsvømning");
  }
  if (member.butterfly) {
    listOfDisciplines.push("Butterfly");
  }

  return listOfDisciplines;
}
function checkCompetitorOrExerciser(member) {
  if (member.competetive) {
    member.competetive = "Konkurrent";
  } else {
    member.competetive = "Motionist";
  }
}

function checkMembership(member) {
  if (member.active) {
    member.active = "Aktivt medlem";
  } else {
    member.active = "Passivt medlem";
  }
}
function addCoach(member) {
if (member.competetive && member.age < 18) {
  member.trid = "Holger Jacobsen"  
} else if (member.competetive && member.age > 18) {
  member.trid = "Line Frederiksen"
}  
}


function changeCreateCheckboxes() {
  const createBoxes = document.querySelectorAll(".create-discipline");
  createBoxes.forEach(box => {
    box.checked = false;
    box.disabled = !box.disabled;
  });
}

function changeUpdateCheckboxes() {
  const updateValue = document.querySelector("#formand-update-competetive").value === "true";
  const updateBoxes = document.querySelectorAll(".update-discipline");
  updateBoxes.forEach(box => {
    box.disabled = !updateValue;
  });
}


export { ageCalculator, ageToGroup, checkDiscipline, checkMembership, checkCompetitorOrExerciser, addCoach, changeCreateCheckboxes,changeUpdateCheckboxes };
