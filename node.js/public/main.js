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

// Function to display city information in an overlay window
// function displayCities(cityData) {
//   if (cityData === null || cityData.length === 0) {
//     alert("The Country entered is wrong! Try again.");
//     return;
//   } else {
//     //Contruct the Overlay Element
//     const citiesOverlay = document.createElement("div");
//     citiesOverlay.classList.add("cities-overlay");
//     // Overlay title
//     const overlayHeader = document.createElement("h2");
//     const countryName = cityData[0].cou_name_en;
//     overlayHeader.textContent = "Top 5 Cities in " + countryName;
//     citiesOverlay.appendChild(overlayHeader);
//     // Overlay table for the cities
//     const tableBody = document.createElement("table");
//     tableBody.classList.add("cities-table");

//     const thead = document.createElement("thead");
//     const row = tableBody.insertRow();
//     row.insertCell(0).textContent = "City Name";
//     row.insertCell(1).textContent = "Population";

//     // Fill up the table with the API response
//     const tbody = tableBody.insertRow();
//     for (const city of cityData) {
//       const row = tableBody.insertRow();
//       row.insertCell(0).textContent = city.name;
//       row.insertCell(1).textContent = city.population;
//     }
//     // Overlay "close" functionality
//     const closeButton = document.createElement("button");
//     closeButton.textContent = "Close";
//     closeButton.addEventListener("click", () => {
//       overlayContainer.classList.add("hidden");
//       citiesOverlay.remove(); // Remove the Overlay contained elements
//     });

//     citiesOverlay.appendChild(tableBody);
//     citiesOverlay.appendChild(closeButton);

//     const overlayContainer = document.querySelector("#overlay-container");
//     overlayContainer.appendChild(citiesOverlay);
//     citiesOverlay.classList.remove("hidden");
//   }
// }function displayCities(cityData) {
//   if (cityData === null || cityData.length === 0) {
//     alert("The Country entered is wrong! Try again.");
//     return;
//   } else {
//     //Contruct the Overlay Element
//     const citiesOverlay = document.createElement("div");
//     citiesOverlay.classList.add("cities-overlay");
//     // Overlay title
//     const overlayHeader = document.createElement("h2");
//     const countryName = cityData[0].cou_name_en;
//     overlayHeader.textContent = "Top 5 Cities in " + countryName;
//     citiesOverlay.appendChild(overlayHeader);
//     // Overlay table for the cities
//     const tableBody = document.createElement("table");
//     tableBody.classList.add("cities-table");

//     const thead = document.createElement("thead");
//     const row = tableBody.insertRow();
//     row.insertCell(0).textContent = "City Name";
//     row.insertCell(1).textContent = "Population";

//     // Fill up the table with the API response
//     const tbody = tableBody.insertRow();
//     for (const city of cityData) {
//       const row = tableBody.insertRow();
//       row.insertCell(0).textContent = city.name;
//       row.insertCell(1).textContent = city.population;
//     }
//     // Overlay "close" functionality
//     const closeButton = document.createElement("button");
//     closeButton.textContent = "Close";
//     closeButton.addEventListener("click", () => {
//       overlayContainer.classList.add("hidden");
//       citiesOverlay.remove(); // Remove the Overlay contained elements
//     });

//     citiesOverlay.appendChild(tableBody);
//     citiesOverlay.appendChild(closeButton);

//     const overlayContainer = document.querySelector("#overlay-container");
//     overlayContainer.appendChild(citiesOverlay);
//     citiesOverlay.classList.remove("hidden");
//   }
// }

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
    tabContainer.classList.add("tab-pane", "fade");
    tabContainer.innerHTML = `
            <h2>Top 5 Cities in ${countryName}</h2>
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
            <a class="nav-link" id="${tabId}-nav" data-toggle="tab" href="#${tabId}-tab">${countryName}</a>
        `;

    // Append the new tab container and tab navigation link
    document.getElementById("overlay-container").appendChild(tabContainer);
    document.getElementById("tabs").appendChild(tabNav);
  }

  // Hide the previous tab
  const previousTab = document.querySelector(".tab-pane.active");
  if (previousTab) {
    previousTab.classList.remove("active", "show");
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
  const newTab = new bootstrap.Tab(document.getElementById(tabId + "-nav"));
  newTab.show();
}
