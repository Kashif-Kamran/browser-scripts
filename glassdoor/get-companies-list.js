/*
Navigate to companies section and peast this script inside console of browser it will return a data.csv file with all the companies sorted inform of ratting

*/

function scrapeCompanyData() {
  const companies = Array.from(
    document.querySelectorAll('[data-test="employer-card-single"]')
  );
  return companies.map((company) => {
    const name = company.querySelector(
      '[data-test="employer-short-name"]'
    ).textContent;
    const employees = company.querySelector(
      '[data-test="employer-size"]'
    ).textContent;
    const rating = company.querySelector('[data-test="rating"]').textContent;
    return {
      name,
      employees,
      rating,
    };
  });
}

// Wait for milliseconds // Returns promise therefore use await
function waitForMilliseconds(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
}

// Function to move to the next page
function navigateNextPage() {
  return document.querySelector('[data-test="pagination-next"]').click();
}

async function main() {
  const dataEntries = [];

  let page = 1;
  while (page < 10) {
    const data = scrapeCompanyData();
    dataEntries.push(...data); // Spread the data array into the main array
    navigateNextPage();
    await waitForMilliseconds(4000);
    page++;
  }
  // Sort the dataEntries based on rating
  dataEntries.sort((a, b) => b.rating - a.rating);

  // Convert the array of objects into CSV format
  function convertToCSV(data) {
    const header = Object.keys(data[0]).join(",") + "\n";
    const rows = data.map((entry) => Object.values(entry).join(",")).join("\n");
    return header + rows;
  }

  // Download the CSV file
  function downloadCSV(data, filename = "data.csv") {
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Call downloadCSV to download the file
  downloadCSV(dataEntries);
}

main();
