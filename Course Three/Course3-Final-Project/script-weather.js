// API Configuration
const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your actual API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const currentLocationBtn = document.getElementById('currentLocationBtn');
const recentSearches = document.getElementById('recentSearches');
const weatherContainer = document.getElementById('weatherContainer');
const forecastContainer = document.getElementById('forecastContainer');

// Recent searches array
let recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];

// Fetch weather data
async function fetchWeatherData(city) {
    try {
        // Fetch current weather
        const currentResponse = await fetch(`${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`);
        if (!currentResponse.ok) throw new Error('City not found');
        
        const currentData = await currentResponse.json();
        
        // Fetch forecast
        const forecastResponse = await fetch(`${BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`);
        if (!forecastResponse.ok) throw new Error('Forecast not available');
        
        const forecastData = await forecastResponse.json();
        
        return { current: currentData, forecast: forecastData };
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}

// Display weather data
function displayWeatherData(data) {
    const { current, forecast } = data;
    
    // Update current weather
    weatherContainer.innerHTML = `
        <div class="flex flex-col md:flex-row items-center justify-between">
            <div class="flex items-center mb-4 md:mb-0">
                <img src="https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png" 
                     alt="${current.weather[0].description}" 
                     class="w-20 h-20">
                <div class="ml-4">
                    <h2 class="text-2xl font-bold">${current.name}, ${current.sys.country}</h2>
                    <p class="text-indigo-300">${new Date().toLocaleDateString()}</p>
                    <p class="text-xl capitalize">${current.weather[0].description}</p>
                </div>
            </div>
            <div class="grid grid-cols-3 gap-6 text-center">
                <div>
                    <p class="text-3xl font-bold">${Math.round(current.main.temp)}°C</p>
                    <p class="text-indigo-300">Temperature</p>
                </div>
                <div>
                    <p class="text-3xl font-bold">${current.wind.speed} m/s</p>
                    <p class="text-indigo-300">Wind</p>
                </div>
                <div>
                    <p class="text-3xl font-bold">${current.main.humidity}%</p>
                    <p class="text-indigo-300">Humidity</p>
                </div>
            </div>
        </div>
    `;
    weatherContainer.classList.remove('hidden');
    
    // Update forecast
    const dailyForecasts = filterDailyForecast(forecast.list);
    forecastContainer.innerHTML = `
        <h2 class="text-2xl font-bold text-primary mb-4">5-Day Forecast</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            ${dailyForecasts.slice(0, 5).map(day => `
                <div class="bg-slate-800 rounded-lg p-4 text-center hover:bg-slate-700 transition-colors">
                    <p class="font-semibold mb-2">${new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                    <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" 
                         alt="${day.weather[0].description}" 
                         class="mx-auto w-12 h-12">
                    <p class="text-xl font-bold mt-2">${Math.round(day.main.temp)}°C</p>
                    <div class="flex justify-around mt-3 text-sm">
                        <span>${day.wind.speed} m/s</span>
                        <span>${day.main.humidity}%</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    forecastContainer.classList.remove('hidden');
    
    // Add to recent searches
    addToRecentSearches(current.name);
}

// Helper function to get daily forecast (one per day)
function filterDailyForecast(forecastList) {
    const dailyForecasts = [];
    const dates = new Set();
    
    forecastList.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!dates.has(date) && item.dt_txt.includes('12:00:00')) {
            dates.add(date);
            dailyForecasts.push(item);
        }
    });
    
    return dailyForecasts;
}

// Add city to recent searches
function addToRecentSearches(city) {
    if (!recentCities.includes(city)) {
        recentCities.unshift(city);
        if (recentCities.length > 5) recentCities.pop();
        localStorage.setItem('recentCities', JSON.stringify(recentCities));
        updateRecentSearchesDropdown();
    }
}

// Update recent searches dropdown
function updateRecentSearchesDropdown() {
    if (recentCities.length > 0) {
        recentSearches.innerHTML = recentCities.map(city => `
            <div class="p-3 hover:bg-slate-600 cursor-pointer rounded-lg" onclick="searchCity('${city}')">${city}</div>
        `).join('');
        recentSearches.classList.remove('hidden');
    } else {
        recentSearches.classList.add('hidden');
    }
}

// Search city function (exposed to global scope)
window.searchCity = function(city) {
    cityInput.value = city;
    searchWeather();
};

// Search weather by city
async function searchWeather() {
    const city = cityInput.value.trim();
    if (!city) return;
    
    try {
        const weatherData = await fetchWeatherData(city);
        displayWeatherData(weatherData);
    } catch (error) {
        alert('Error: Could not find weather data for this location. Please try another city.');
    }
}

// Get weather by current location
function getCurrentLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await fetch(`${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`);
                    const data = await response.json();
                    cityInput.value = data.name;
                    const weatherData = await fetchWeatherData(data.name);
                    displayWeatherData(weatherData);
                } catch (error) {
                    alert('Error getting your location weather. Please try again.');
                }
            },
            (error) => {
                alert('Error: Please enable location access to use this feature.');
            }
        );
    } else {
        alert('Geolocation is not supported by your browser.');
    }
}

// Event Listeners
searchBtn.addEventListener('click', searchWeather);
currentLocationBtn.addEventListener('click', getCurrentLocationWeather);

cityInput.addEventListener('focus', updateRecentSearchesDropdown);
cityInput.addEventListener('blur', () => {
    setTimeout(() => recentSearches.classList.add('hidden'), 200);
});

// Initialize recent searches dropdown
updateRecentSearchesDropdown();