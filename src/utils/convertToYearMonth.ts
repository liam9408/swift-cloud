function convertToYearMonth(input: string) {
  const monthMappings: { [key: string]: string } = {
    January: '01',
    February: '02',
    March: '03',
    April: '04',
    May: '05',
    June: '06',
    July: '07',
    August: '08',
    September: '09',
    October: '10',
    November: '11',
    December: '12',
  };

  const regex = /plays(\w+)/;
  const matches = input.match(regex);

  if (matches && matches[1] in monthMappings) {
    const month = monthMappings[matches[1]];
    const year = '2023'; // You can change the year as needed
    return year + month;
  }

  return null; // Return null for invalid input
}

export default convertToYearMonth;
