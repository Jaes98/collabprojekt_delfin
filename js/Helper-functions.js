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
    member.trid = "Holger Jacobsen";
  } else if (member.competetive && member.age > 18) {
    member.trid = "Line Frederiksen";
  }
}

function changeCreateCheckboxes() {
  const createBoxes = document.querySelectorAll(".create-discipline");
  createBoxes.forEach((box) => {
    box.checked = false;
    box.disabled = !box.disabled;
  });
}

function changeUpdateCheckboxes() {
  const updateValue = document.querySelector("#formand-update-competetive").value === "true";
  const updateBoxes = document.querySelectorAll(".update-discipline");
  updateBoxes.forEach((box) => {
    box.disabled = !updateValue;
  });
}

function refinedData(result) {
  ageCalculator(result);

  ageToGroup(result);

  addCoach(result);

  checkCompetitorOrExerciser(result);

  checkMembership(result);

  return result;
}

function timeChecker(timeValue) {
  let actualTime = timeValue
  console.log(actualTime);
  if (timeValue.includes(",")) {
    actualTime = timeValue.replace(",", ".");
  }
  console.log(actualTime);
  if (isNaN(Number(actualTime))) {
    console.error("ERROR: Time is not a number");
    return false
  } else return actualTime
}

function dateChecker(dateValue) {
  if (isNaN(Date.parse(dateValue))){
    console.error("ERROR: Date is incorrect! Use format: åååå-mm-dd");
    return false}
  else return dateValue
}

function competitionBooleanToString(result) {
  let competition = "";
  if (result.competition) competition = "Konkurrence";
  else if (result.competition === false) competition = "Træning";
  return competition;
}

function disciplinesEngToDa(result) {
  let disciplin = "";
  if (result.discipline === "crawl") disciplin = "Crawl";
  else if (result.discipline === "butterfly") disciplin = "Butterfly";
  else if (result.discipline === "backCrawl") disciplin = "Rygcrawl";
  else if (result.discipline === "breaststroke") disciplin = "Bryst svømning";
  return disciplin;
}

function dateToDato(result) {
  console.log("datetodato:",result);
  let dato = "";
  const dates = result.date.split("-");

  dato = dates[2] + "-" + dates[1] + "-" + dates[0];
  return dato;
}

export { checkDiscipline, changeCreateCheckboxes, changeUpdateCheckboxes, refinedData, timeChecker, dateChecker, dateToDato,disciplinesEngToDa,competitionBooleanToString };
