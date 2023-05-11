function ageCalculator(bday) {
  const birthday = new Date(bday);
  const today = new Date();
  const ageInMilis = today - birthday;
  const miliSecondsInAYear = 1000 * 60 * 60 * 24 * 365;
  return Math.floor(ageInMilis / miliSecondsInAYear);
}

export { ageCalculator };
