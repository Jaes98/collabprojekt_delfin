function ageCalculator(bday) {
  const birthday = new Date(bday);
  const today = new Date();
  const ageInMilis = today - birthday;
  const miliSecondsInAYear = 1000 * 60 * 60 * 24 * 365;
  return Math.floor(ageInMilis / miliSecondsInAYear);
}

function ageToGroup(ageInYears) {
  // const ageGroup =
  if (ageInYears < 18) {
    return "Junior";
  } else if (ageInYears < 60) {
    return "Senior";
  } else {
    return "Senior+";
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
