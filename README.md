# Exercise3 - JS City Population App


## Description

This is a JS-based web page that retrieves information about the population of cities. 
The data is accessible in JSON format on the REST API endpoint: 'https://data.opendatasoft.com/explore/dataset/geonames-all-cities-with-a-population-1000%40public/api/?disjunctive.cou_name_en '


### The web application contains:

    1.- An user input element for a country name. index.html code snippet:
                <label for="countryInput">Enter Country Name in English:</label>
                <input type="text" id="countryInput" placeholder="Type a country name">
                <button onclick="searchCities()">Search Cities</button>

    2.- An API query with an appropriate query string that determines the population of the 5 biggest cities in the user selected country. Example used in the server-side of this application:
                const apiUrl = 'https://data.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000@public/records?select=name%2C%20population%2C%20cou_name_en&order_by=population%20DESC&limit=5&refine=cou_name_en%3A' + encodeURIComponent(country);

    3.- An interface where:

        3.1.- The information "City name, population" is displayed to the user in a table, ordered by decreasing population size. Code snippet: 
                    // Fill up the table with the API response
                    const tbody = tableBody.insertRow();
                    for (const city of cityData) {
                        const row = tableBody.insertRow();
                        row.insertCell(0).textContent = city.name;
                        row.insertCell(1).textContent = city.population;
                    }

        3.2.- An Leaftlet map, where the user clicks on a position on the map, then the application will determine the country and the population information. Code snippet:
                    // Leaflet map setup
                    const map = L.map('map').setView([0, 0], 2);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
                    // Event listener for map click
                    map.on('click', (e) => {
                    const latlng = e.latlng;
                    getCountryInfo(latlng.lat, latlng.lng);
                    });


### In terms of design (requirements):

    1.- The REST API query limits the response size to the minimally required data and avoids any "unneeded data" in the response. Code snippet:
            // Build the API URL
            const apiUrl = 'https://data.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000@public/records?select=name%2C%20population%2C%20cou_name_en&order_by=population%20DESC&limit=5&refine=cou_name_en%3A' + encodeURIComponent(country);
            console.log('API Request to OpenData: ', apiUrl);
            // Make the API call
            const response = await fetch(apiUrl); 
            // Store the response in JSON format
            const data = await response.json();
            // Return the response to client-side
            res.json(data);

    2.- The OpenStreetMap response is displayed in an overlay window With a "close" functionality so the user can "click" on the map again, if desired.

    3.- The Leaflet JS library which is a lightweight and versatile library for creating interactive maps. The Leaflet library is then used to set up the map and handle map-related functionalities in the main.js file.

    4.- The Docker-compose stack 'nginx-nodejs-mariadb' is used to run this JS-based web application. Here's why:
            * Node.js Application: The provided JavaScript code is written using Node.js for the server-side logic. The code includes client-side JavaScript that interacts with the OpenStreetMap API and performs various operations on the frontend. Therefore, a Node.js environment is required to run this application.
            * Nginx: Nginx is commonly used as a web server and as a reverse proxy, forwarding requests to back-end servers, avoiding CORS (Cross-Origin Resource Sharing) issues. In this case, it is purely dedicated to reverse proxy end-user requests.


## Installation    

Before using this application, you need complete the below steps.

1.- Run this command "npm install" in the folder "./node.js" tp install Node.js modules locally.
2.- Build the docker-compose stack image "docker-compose up --build -d" in the APP root directory where the "docker-compose.yml" is located.

Once the build is complete and all containers are running, you should be able to try this application from your browser, search this: http://localhost:8080/
