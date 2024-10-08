import express from 'express';
import fetch from 'node-fetch';
import bodyParser from 'body-parser';
// Use dynamic import to import node-fetch
//const fetch = import('node-fetch').then(module => module.default);

const app = express();
const port = 8081;

// Middleware to log incoming requests
app.use(bodyParser.json());
app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    next();
});

// Serve client-side static assets from the "public" directory
app.use(express.static(new URL('public', import.meta.url).pathname));

// API endpoint to retrieve cities data
app.get('/api/cities', async (req, res) => {
    try {
        const regex = /^[A-Z]{2}$/;
        const country = req.query.country;
        console.log('Looking for the top 5 cities of: ', country);
        if(regex.test(country)){
            //Country output from Map click
            const apiUrl = 'https://data.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000@public/records?select=name%2C%20population%2C%20cou_name_en&order_by=population%20DESC&limit=5&refine=country_code%3A' + encodeURIComponent(country);
            console.log('API Request to OpenData: ', apiUrl);
            const response = await fetch(apiUrl); // Make the API call
            console.log('API Response:', response.status, response.statusText);
            const data = await response.json();
            console.log("Servejs response:", data);
            res.json(data);
        } else {
            // Country output from user input
            const apiUrl = 'https://data.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000@public/records?select=name%2C%20population%2C%20cou_name_en&order_by=population%20DESC&limit=5&refine=cou_name_en%3A' + encodeURIComponent(country);
            console.log('API Request to OpenData: ', apiUrl);
            const response = await fetch(apiUrl); // Make the API call
            console.log('API Response:', response.status, response.statusText);
            const data = await response.json();
            console.log("Servejs response:", data);
            res.json(data);
        }
    } catch (error) {
        console.error('Error fetching cities data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// API endpoint for reverse geocoding to get country info
app.get('/api/country-info', async (req, res) => {
    try {
        const lat = req.query.lat;
        const lon = req.query.lon;
        const apiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

        // Make the API call
        const response = await fetch(apiUrl);

        // Log the response to the console
        console.log('API Response:', response.status, response.statusText);

        if (!response.ok) {
            console.error('Error fetching country info - Status:', response.status);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching country info:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`[JS app] Server running at http://localhost:${port}`);
});

// Set timeout to 30 seconds (adjust as needed)
app.timeout = 30000; 