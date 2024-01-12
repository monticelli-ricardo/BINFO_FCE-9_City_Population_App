// Leaflet map setup
const map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Event listener for map click
map.on('click', (e) => {
  const latlng = e.latlng;
  getCountryInfo(latlng.lat, latlng.lng);
});

// Function to search cities by country
function searchCities() {
  const countryInput = document.getElementById('countryInput').value;
  if (!countryInput) {
    alert('Please enter a country name.');
    return;
  }

  // Construct API query URL with specific fields
  const apiUrl = `/api/cities?country=${encodeURIComponent(countryInput)}`;

  // Make Axios request to the API
  axios.get(apiUrl)
    .then(response => {
      if (response.status === 200) {
        console.log('/api/cities Response:', response);
        const data = response.data;
        displayCities(data.results);
      } else {
        console.error('Error fetching data:', response);
      }
    })
    .catch(error => console.error('Error fetching data:', error));
}

// Function to get country information by coordinates
function getCountryInfo(latitude, longitude) {
  // Construct API query URL for reverse geocoding
  const apiUrl = `/api/country-info?lat=${latitude}&lon=${longitude}`;

  // Make Axios request to the API
  axios.get(apiUrl)
    .then(response => {
      if (response.status === 200) {
        console.log('/api/country-info Response:', response);
        const data = response.data;
        var countryCode = data.address.country_code;
        countryCode = countryCode.toUpperCase();
        searchCitiesByCountry(countryCode);
      } else {
        console.error('Error fetching country data:', response);
      }
    })
    .catch(error => console.error('Error fetching country data:', error));
}

// Function to search cities by country
function searchCitiesByCountry(countryCode) {
  // Construct API query URL with specific fields
  const apiUrl = `/api/cities?country=${encodeURIComponent(countryCode)}`;

  // Make Axios request to the API
  axios.get(apiUrl)
    .then(response => {
      if (response.status === 200) {
        console.log('/api/cities Response:', response);
        const data = response.data;
        displayCities(data.results);
      } else {
        console.error('Error fetching data:', response);
      }
    })
    .catch(error => console.error('Error fetching data:', error));
}

// Function to display city information in an overlay window
function displayCities(cityData) {
    const citiesOverlay = document.createElement('div');
    citiesOverlay.classList.add('cities-overlay');
  
    const overlayHeader = document.createElement('h2');
    overlayHeader.textContent = 'Top 5 Cities in Selected Country: ' + cityData.results[0].cou_name_en;
    citiesOverlay.appendChild(overlayHeader);
  
    const tableBody = document.createElement('table');
    tableBody.classList.add('cities-table');
  
    const thead = document.createElement('thead');
    const row = tableBody.insertRow();
    row.insertCell(0).textContent = 'City Name';
    row.insertCell(1).textContent = 'Population';
  
    const tbody = tableBody.insertRow();
    for (const city of cityData) {
      const row = tableBody.insertRow();
      row.insertCell(0).textContent = city.name;
      row.insertCell(1).textContent = city.population;
    }
  
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.addEventListener('click', () => {
      overlayContainer.classList.add('hidden');
      citiesOverlay.remove();
    });
    
  
    citiesOverlay.appendChild(tableBody);
    citiesOverlay.appendChild(closeButton);
  
    const overlayContainer = document.querySelector('#overlay-container');
    overlayContainer.appendChild(citiesOverlay);
    citiesOverlay.classList.remove('hidden');
  }