// Initialize map
let map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let markers = L.layerGroup().addTo(map);

// Function to get weather and update map
async function getWeather() {
    const location = document.getElementById('locationInput').value.trim();
    if (!location) {
        displayError('Please enter a city or location.');
        return;
    }
    
    const apiKey = '8dcb363e0d7731f681c400d46357a850'; // Replace with your OpenWeatherMap API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`;
    
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            const errorDetail = await response.text();
            throw new Error(`Weather data not found: ${errorDetail}`);
        }
        
        const data = await response.json();
        if (data.cod !== 200) {
            throw new Error(`Error ${data.cod}: ${data.message}`);
        }

        updateWeatherDisplay(data);
        updateMapLocation(data.coord.lat, data.coord.lon);
    } catch (error) {
        displayError(error.message);
    }
}

// Function to update weather display
function updateWeatherDisplay(data) {
    document.querySelector('.temperature').textContent = `${data.main.temp}°C`;
    document.querySelector('.description').textContent = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);
    document.querySelector('.icon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    document.querySelector('#weatherDisplay').classList.add('show'); // Updated selector
    document.querySelector('#error-message').textContent = '';
}

// Function to update map location
function updateMapLocation(lat, lon) {
    map.setView([lat, lon], 13);

    // Clear any existing markers and add a new marker for the location
    markers.clearLayers();
    L.marker([lat, lon]).addTo(markers)
        .bindPopup('Weather Location')
        .openPopup();
}

// Function to handle errors
function displayError(message) {
    document.querySelector('.temperature').textContent = '';
    document.querySelector('.description').textContent = '';
    document.querySelector('.icon').src = '';
    document.querySelector('#error-message').textContent = message;
    console.error('Error fetching weather data:', message);
}

// Function to get weather for favorite locations
function getFavoriteWeather(city) {
    document.getElementById('locationInput').value = city;
    getWeather();
}
