// Show loader function
function showLoader() {
    const loader = document.getElementById('loader');
    loader.style.display = 'block';
    document.getElementById("countryDetailsTable").style.display = 'none'; // Hide the table while loading
}

// Hide loader function
function hideLoader() {
    const loader = document.getElementById('loader');
    loader.style.display = 'none';
    document.getElementById("countryDetailsTable").style.display = 'table'; // Show the table when data is ready
}

// Fetch list of countries and bind to the dropdown
export async function fetchCountries() {
    const dropdown = document.getElementById("countryDropdown");
    showLoader(); // Show loader while fetching countries
    try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const countries = await response.json();
        countries.sort((a, b) => a.name.common.localeCompare(b.name.common)); // Sort alphabetically
        countries.forEach(country => {
            const option = document.createElement("option");
            option.value = country.cca3; // Country Code (ISO 3166-1 alpha-3)
            option.textContent = country.name.common; // Common Name
            dropdown.appendChild(option);
        });

        // Automatically select the first country from the dropdown if available
        if (dropdown.options.length > 1) {
            dropdown.selectedIndex = 1; // Select the first country (skipping the default "-- Select a Country --")
            fetchCountryDetails(dropdown.value); // Fetch details for the selected country
        }
    } catch (error) {
        console.error("Error fetching countries:", error);
    }
    hideLoader(); // Hide loader when fetching countries is complete
}

// Fetch and display country details in the table
export async function fetchCountryDetails(countryCode) {
    const tableBody = document.querySelector("#countryDetailsTable tbody");
    tableBody.innerHTML = ""; // Clear existing rows
    if (!countryCode) return;

    showLoader(); // Show loader while fetching country details
    try {
        const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
        const [country] = await response.json();
        const details = {
            "Name": country.name.common,
            "Population": country.population.toLocaleString(),
            "Region": country.region,
            "Subregion": country.subregion,
            "Capital": country.capital ? country.capital[0] : "N/A",
            "Area (km²)": country.area.toLocaleString(),
            "Languages": Object.values(country.languages || {}).join(", ") || "N/A",
        };

        for (const [key, value] of Object.entries(details)) {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${key}</td><td>${value}</td>`;
            tableBody.appendChild(row);
        }
    } catch (error) {
        console.error("Error fetching country details:", error);
    }
    hideLoader(); // Hide loader when country details are fetched
}

// Event listener for dropdown selection
document.getElementById("countryDropdown").addEventListener("change", (event) => {
    fetchCountryDetails(event.target.value);
});

// Initialize the dropdown on page load
fetchCountries();
