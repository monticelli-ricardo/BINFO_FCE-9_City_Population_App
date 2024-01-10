# Exercise3 - JS City Population App

## Description
This is a JS-based web page that retrieves information about the population of cities. 
The data is accessible in JSON format on the REST API endpoint: 'https://data.opendatasoft.com/explore/dataset/geonames-all-cities-with-a-population-1000%40public/api/?disjunctive.cou_name_en '

### The web application contains:
    1.- An user input element for a country name.
    2.- An API query with an appropriate query string that determines the population of the 5 biggest cities in the user selected country. 
    3.- An interface where:
        3.1.- The information "City name, population" is displayed to the user in a table, ordered by decreasing population size.
        3.2.- An OpenStreetMap map, where the user clicks on a position on the map, then the application will determine the country and the population information. 

### In terms of design (requirements):
    1.- The REST API query limits the response size to the minimally required data and avoids any "unneeded data" in the response. Code snippet:
            // Construct API query URL with specific fields
            var apiUrl = 'https://data.opendatasoft.com/explore/dataset/geonames-all-cities-with-a-population-1000%40public/api/?disjunctive.cou_name_en&fields=city_name,population&refine.cou_name_en=' + countryInput;
            // Fetch data from API
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => displayCities(data.records))
                .catch(error => console.error('Error fetching data:', error));
    2.- The OpenStreetMap response is displayed in an overlay window With a "close" functionality so the user can "click" on the map again, if desired.
    3.- The Leaflet JS library which is a lightweight and versatile library for creating interactive maps. The Leaflet library is then used to set up the map and handle map-related functionalities in the main.js file.
    4.- The Docker-compose stack 'nginx-nodejs-mariadb' is used to run this JS-based web application. Here's why:
            * Node.js Application: The provided JavaScript code is written using Node.js for the server-side logic. The code includes client-side JavaScript that interacts with the OpenStreetMap API and performs various operations on the frontend. Therefore, a Node.js environment is required to run this application.
            * Nginx: Nginx is commonly used as a web server and as a reverse proxy, forwarding requests to back-end servers, avoiding CORS (Cross-Origin Resource Sharing) issues. In this case, it is purely dedicated to reverse proxy end-user requests.

## Installation    

Before using this application, you need complete the below steps.

1.- Install Node.js modules locally. Run this command "npm install" in the folder "./node.js".
2.- Build the docker-compose stack image "docker-compose up --build -d" in the APP root directory where the "docker-compose.yml" is located.

Once the build is complete and all containers are running, you should be able to try this application from your browser, search this: http://localhost:8080/
