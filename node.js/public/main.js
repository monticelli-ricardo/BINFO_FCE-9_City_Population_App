// Leaflet map setup
var map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Event listener for map click
map.on('click', function (e) {
    var latlng = e.latlng;
    getCountryInfo(latlng.lat, latlng.lng);
});

// Function to search cities by country
function searchCities() {
    var countryInput = document.getElementById('countryInput').value;
    if (!countryInput) {
        alert('Please enter a country name.');
        return;
    }

    // Construct API query URL with specific fields
    var apiUrl = '/api/cities?country=' + encodeURIComponent(countryInput);

    // Fetch data from API
    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        console.log('API Response:', data.records);
        // Assuming data is always an array
        if (Array.isArray(data)) {
            displayCities(data[0].records);
        } else { // Alternatively, if data could be an object, handle it accordingly
            displayCities(data.records);
        }
    })
    .catch(error => console.error('Error fetching data:', error));
}

// Function to display city information in a table
function displayCities(cityData) {
    var tableBody = document.querySelector('#resultTable tbody');
    tableBody.innerHTML = '';
    console.log('[Node.js] cityData to sort:', cityData);
       // Check if cityData is defined
       if (cityData && cityData.length > 0) {
        // Sort cityData by population in descending order
        cityData.sort((a, b) => b.fields.population - a.fields.population);

        // Display top 5 cities
        for (var i = 0; i < Math.min(5, cityData.length); i++) {
            var city = cityData[i].fields;
            var row = tableBody.insertRow();
            row.insertCell(0).textContent = city.city_name;
            row.insertCell(1).textContent = city.population;
        }
    } else {
        console.error('[Node.js] ERROR - Invalid cityData:', cityData);
    }
}

// Function to get country information by coordinates
function getCountryInfo(latitude, longitude) {
    // Construct API query URL for reverse geocoding
    var apiUrl = `/api/country-info?lat=${latitude}&lon=${longitude}`;

    // Fetch data from reverse geocoding API
    fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        var countryName = data.address.country;
        searchCitiesByCountry(countryName);
    })
    .catch(error => console.error('Error fetching country data:', error));
}

// Function to search cities by country
function searchCitiesByCountry(countryName) {
    // Construct API query URL with specific fields
    var apiUrl = '/api/cities?country=' + encodeURIComponent(countryName);

    // Fetch data from API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => displayCities(data.records))
        .catch(error => console.error('Error fetching data:', error));
}
