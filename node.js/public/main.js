// Leaflet map setup
const map = L.map("map").setView([0, 0], 2);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

// Event listener for map click
map.on("click", (e) => {
  const latlng = e.latlng;
  getCountryInfo(latlng.lat, latlng.lng);
});

// Function to search cities by country
function searchCities() {
  const countryInput = document.getElementById("countryInput").value;

  // Convert to lowercase and then capitalize
  const formattedCountryInput = countryInput
    .toLowerCase()
    .replace(/\b\w/g, (match) => match.toUpperCase());
  if (!formattedCountryInput) {
    alert(
      "Please enter a country name. Example:\n   - BAD: Brasil\n   - GOOD: Brazil",
    );
    return;
  }

  // Construct API query URL with specific fields
  const apiUrl = `/api/cities?country=${encodeURIComponent(
    formattedCountryInput,
  )}`;

  // Make Axios request to the API
  axios
    .get(apiUrl)
    .then((response) => {
      if (response.status === 200) {
        console.log("/api/cities Response:", response);
        const data = response.data;
        displayCities(data.results);
        document.getElementById("countryInput").value = "";
      } else {
        console.error("Error fetching data:", response);
      }
    })
    .catch((error) => console.error("Error fetching data:", error));
}

// Function to get country information by coordinates
function getCountryInfo(latitude, longitude) {
  // Construct API query URL for reverse geocoding
  const apiUrl = `/api/country-info?lat=${latitude}&lon=${longitude}`;

  // Make Axios request to the API
  axios
    .get(apiUrl)
    .then((response) => {
      if (response.status === 200) {
        console.log("/api/country-info Response:", response);
        const data = response.data;
        var countryCode = data.address.country_code;
        countryCode = countryCode.toUpperCase();
        searchCitiesByCountry(countryCode);
      } else {
        console.error("Error fetching country data:", response);
      }
    })
    .catch((error) => console.error("Error fetching country data:", error));
}

// Function to search cities by country
function searchCitiesByCountry(countryCode) {
  // Construct API query URL with specific fields
  const apiUrl = `/api/cities?country=${encodeURIComponent(countryCode)}`;

  // Make Axios request to the API
  axios
    .get(apiUrl)
    .then((response) => {
      if (response.status === 200) {
        console.log("/api/cities Response:", response);
        const data = response.data;
        displayCities(data.results);
      } else {
        console.error("Error fetching data:", response);
      }
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function displayCities(cityData) {
  if (cityData === null || cityData.length === 0) {
    alert("The Country entered is wrong! Try again.");
    return;
  }

  // Extract country name from the first city data
  const countryName = cityData[0].cou_name_en;

  // Create a unique ID for the tab based on the country name
  const tabId = countryName.replace(/\s+/g, "-").toLowerCase();

  // Create or retrieve the tab container
  let tabContainer = document.getElementById(tabId + "-tab");
  if (!tabContainer) {
    // If the tab container doesn't exist, create it
    tabContainer = document.createElement("div");
    tabContainer.id = tabId + "-tab";
    tabContainer.classList.add("tab-pane", "inactive"); // Initially set as inactive
    tabContainer.innerHTML = `
            <div class="d-flex justify-content-between align-items-center my-3">
                <h2 class="m-0">Top 5 Cities in ${countryName}</h2>
                <button type="button" class="btn btn-danger btn-sm rounded-circle" onclick="removeTab('${tabId}')">x</button>
            </div>
            <table class="table cities-table">
                <thead>
                    <tr>
                        <th>City Name</th>
                        <th>Population</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        `;

    // Create a tab navigation link
    const tabNav = document.createElement("li");
    tabNav.classList.add("nav-item");
    tabNav.innerHTML = `
            <div class="d-flex justify-content-between align-items-center px-5">
                <span class="nav-link" id="${tabId}-nav" role="button" data-toggle="tab">${countryName} <button type="button" class="btn btn-danger btn-sm rounded-circle" onclick="removeTab('${tabId}')">x</button></span>
                
            </div>
        `;

    // Add click event listener to the tab navigation link
    tabNav.addEventListener("click", function () {
      // Hide the previous tab
      const previousTab = document.querySelector(".tab-pane.active");
      if (previousTab) {
        previousTab.classList.remove("active", "show");
        previousTab.classList.add("inactive");
      }

      // Show the current tab
      tabContainer.classList.remove("inactive");
      tabContainer.classList.add("active", "show");
    });

    // Append the new tab container and tab navigation link
    document.getElementById("overlay-container").appendChild(tabContainer);
    document.getElementById("tabs").appendChild(tabNav);
  }

  // Hide the previous tab
  const previousTab = document.querySelector(".tab-pane.active");
  if (previousTab) {
    previousTab.classList.remove("active", "show");
    previousTab.classList.add("inactive");
  }

  // Get the table body in the tab container
  const tableBody = tabContainer.querySelector(".cities-table tbody");

  // Clear existing rows in the table
  tableBody.innerHTML = "";

  // Fill up the table with the API response
  for (const city of cityData) {
    const row = tableBody.insertRow();
    row.insertCell(0).textContent = city.name;
    row.insertCell(1).textContent = city.population;
  }

  // Activate the newly created tab
  tabContainer.classList.remove("inactive");
  tabContainer.classList.add("active");
}

// Function to remove a tab
function removeTab(tabId) {
  const tabContainer = document.getElementById(tabId + "-tab");
  const tabNav = document.getElementById(tabId + "-nav");

  if (tabContainer && tabNav) {
    // Remove tab container and tab navigation link
    tabContainer.remove();
    tabNav.parentElement.remove();
  }
}
