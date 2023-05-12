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

export { ageCalculator, ageToGroup, checkDiscipline };
