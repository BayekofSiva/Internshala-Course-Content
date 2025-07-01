let useCelsius = true;
// API Configuration
const API_KEY = 'ab8725384e84705d0057a0cfe9252707'; // Openweather Actual API Key
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
        // First try with country code
        let response = await fetch(`${BASE_URL}/weather?q=${city},IN&units=metric&appid=${API_KEY}`);
        
        // If fails, try without country code
        if (!response.ok) {
            response = await fetch(`${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`);
        }
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'City not found');
        }
        
        const currentData = await response.json();
        const forecastResponse = await fetch(`${BASE_URL}/forecast?q=${currentData.name},${currentData.sys.country}&units=metric&appid=${API_KEY}`);
        
        return {
            current: currentData,
            forecast: await forecastResponse.json()
        };
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

// Display weather data
// Updated displayWeatherData function
function displayWeatherData(data) {
    const { current, forecast } = data;
    
    // Current weather
    document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`;
    document.getElementById('location').innerHTML = `${current.name} <span id="countryFlag" class="ml-2 text-xl">${getCountryFlag(current.sys.country)}</span>`;
    document.getElementById('currentDate').textContent = new Date(current.dt * 1000).toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
    document.getElementById('weatherDesc').textContent = current.weather[0].description;
    document.getElementById('currentTemp').textContent = `${Math.round(current.main.temp)}°C`;
    document.getElementById('tempFeelsLike').textContent = `${Math.round(current.main.feels_like)}°`;
    document.getElementById('windSpeed').textContent = `${current.wind.speed} m/s`;
    document.getElementById('humidity').textContent = `${current.main.humidity}%`;
    document.getElementById('pressure').textContent = `${current.main.pressure} hPa`;
    document.getElementById('visibility').textContent = `${(current.visibility / 1000).toFixed(1)} km`;
    document.getElementById('sunrise').textContent = new Date(current.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById('sunset').textContent = new Date(current.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById('forecastLocation').textContent = `for ${current.name}, ${current.sys.country}`;
    displayForecast(forecast.list, useCelsius);
    
    // Forecast
    const dailyForecasts = filterDailyForecast(forecast.list);
    const forecastHTML = dailyForecasts.slice(0, 5).map(day => `
        <div class="weather-card bg-slate-800 rounded-xl p-4 text-center hover:bg-slate-700 transition-all hover:-translate-y-1">
            <p class="font-semibold mb-2">${new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}</p>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" 
                 alt="${day.weather[0].description}" 
                 class="mx-auto w-14 h-14">
            <p class="text-xl font-bold mt-2">${Math.round(day.main.temp)}°C</p>
            <div class="flex justify-around mt-3 text-sm text-indigo-300">
                <span><i class="fas fa-wind mr-1"></i> ${day.wind.speed} m/s</span>
                <span><i class="fas fa-droplet mr-1"></i> ${day.main.humidity}%</span>
            </div>
        </div>
    `).join('');
    
    document.querySelector('#forecastContainer > div').innerHTML = forecastHTML;
    weatherContainer.classList.remove('hidden');
    forecastContainer.classList.remove('hidden');
}

// Helper function to get country flag emoji
function getCountryFlag(countryCode) {
    return countryCode 
        ? String.fromCodePoint(...[...countryCode.toUpperCase()].map(c => 127397 + c.charCodeAt()))
        : '';
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

// Enhanced search functionality
async function searchWeather() {
    const city = cityInput.value.trim();
    
    // Validation
    if (!city) {
        showError("Please enter a city name");
        return;
    }
    
    // Show loading state
    searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Searching';
    searchBtn.disabled = true;
    
    try {
        const weatherData = await fetchWeatherData(city);
        displayWeatherData(weatherData);
        hideError();
        addToRecentSearches(city);
    } catch (error) {
        showError("Could not find weather data for this location. Please try another city.");
        console.error('Search error:', error);
    } finally {
        searchBtn.innerHTML = '<i class="fas fa-search mr-2"></i> Search';
        searchBtn.disabled = false;
    }
}

// Enhanced current location function
function getCurrentLocationWeather() {
    currentLocationBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Locating';
    currentLocationBtn.disabled = true;
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const response = await fetch(`${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`);
                    
                    if (!response.ok) throw new Error('Location data not available');
                    
                    const data = await response.json();
                    cityInput.value = data.name;
                    const weatherData = await fetchWeatherData(data.name);
                    displayWeatherData(weatherData);
                    addToRecentSearches(data.name);
                    hideError();
                } catch (error) {
                    showError("Error getting your location weather. Please try again.");
                } finally {
                    currentLocationBtn.innerHTML = '<i class="fas fa-location-arrow mr-2"></i> Current Location';
                    currentLocationBtn.disabled = false;
                }
            },
            (error) => {
                let errorMessage = "Error: Please enable location access to use this feature.";
                if (error.code === error.TIMEOUT) {
                    errorMessage = "Location request timed out. Please try again.";
                }
                showError(errorMessage);
                currentLocationBtn.innerHTML = '<i class="fas fa-location-arrow mr-2"></i> Current Location';
                currentLocationBtn.disabled = false;
            },
            { timeout: 10000 } // 10 second timeout
        );
    } else {
        showError("Geolocation is not supported by your browser.");
        currentLocationBtn.innerHTML = '<i class="fas fa-location-arrow mr-2"></i> Current Location';
        currentLocationBtn.disabled = false;
    }
}

// Enhanced recent searches dropdown
function updateRecentSearchesDropdown() {
    if (recentCities.length > 0) {
        recentSearches.innerHTML = recentCities.map(city => `
            <div class="p-3 hover:bg-slate-600 cursor-pointer flex items-center justify-between border-b border-slate-600 last:border-b-0">
                <span onclick="searchCity('${city}')">${city}</span>
                <button onclick="removeRecentCity('${city}', event)" class="text-slate-400 hover:text-red-400">
                    <i class="fas fa-times text-xs"></i>
                </button>
            </div>
        `).join('');
        recentSearches.classList.remove('hidden');
    } else {
        recentSearches.classList.add('hidden');
    }
}

// Remove city from recent searches
function removeRecentCity(city, event) {
    event.stopPropagation();
    recentCities = recentCities.filter(c => c !== city);
    localStorage.setItem('recentCities', JSON.stringify(recentCities));
    updateRecentSearchesDropdown();
}

// Error handling functions
function showError(message) {
    errorMessage.innerHTML = `
        <div class="flex items-start">
            <i class="fas fa-exclamation-triangle mt-1 mr-2"></i>
            <span>${message}.<br>Try: "Delhi,IN" or "New Delhi"</span>
        </div>
    `;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

function displayForecast(forecastList, useCelsius = true) {
    const dailyForecasts = groupForecastByDay(forecastList);
    const forecastContainer = document.querySelector('#forecastContainer > div.grid');
    
    forecastContainer.innerHTML = dailyForecasts.slice(0, 5).map(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        const temp = useCelsius ? Math.round(day.main.temp) : Math.round((day.main.temp * 9/5) + 32);
        const tempUnit = useCelsius ? '°C' : '°F';
        
        return `
            <div class="forecast-card bg-slate-800 rounded-xl p-4 hover:bg-slate-700 transition-all hover:shadow-lg">
                <div class="flex justify-between items-center mb-3">
                    <p class="font-semibold">${dayName}</p>
                    <p class="text-sm text-indigo-300">${dateStr}</p>
                </div>
                <div class="flex items-center justify-center mb-4">
                    <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" 
                         alt="${day.weather[0].description}" 
                         class="w-16 h-16">
                </div>
                <div class="grid grid-cols-2 gap-3 text-center">
                    <div>
                        <p class="text-2xl font-bold">${temp}${tempUnit}</p>
                        <p class="text-xs text-indigo-300">Temperature</p>
                    </div>
                    <div>
                        <p class="text-sm text-indigo-300">${day.weather[0].description}</p>
                    </div>
                </div>
                <div class="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div class="bg-slate-700/50 rounded p-2">
                        <i class="fas fa-wind mr-1"></i> ${day.wind.speed} m/s
                    </div>
                    <div class="bg-slate-700/50 rounded p-2">
                        <i class="fas fa-droplet mr-1"></i> ${day.main.humidity}%
                    </div>
                    <div class="bg-slate-700/50 rounded p-2">
                        <i class="fas fa-temperature-low mr-1"></i> ${useCelsius ? Math.round(day.main.feels_like) : Math.round((day.main.feels_like * 9/5) + 32)}${tempUnit}
                    </div>
                    <div class="bg-slate-700/50 rounded p-2">
                        <i class="fas fa-tachometer-alt mr-1"></i> ${day.main.pressure} hPa
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function groupForecastByDay(forecastList) {
    const days = {};
    forecastList.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!days[date] || item.dt_txt.includes('12:00:00')) {
            days[date] = item;
        }
    });
    return Object.values(days);
}

// Add unit toggle functionality
document.getElementById('toggleUnitsBtn').addEventListener('click', () => {
    useCelsius = !useCelsius;
    const currentData = JSON.parse(sessionStorage.getItem('lastWeatherData'));
    if (currentData) {
        displayForecast(currentData.forecast.list, useCelsius);
        updateCurrentTempDisplay(currentData.current, useCelsius);
    }
});

function updateCurrentTempDisplay(currentData, useCelsius) {
    const tempElement = document.getElementById('currentTemp');
    const feelsLikeElement = document.getElementById('tempFeelsLike');
    
    if (useCelsius) {
        tempElement.textContent = `${Math.round(currentData.main.temp)}°C`;
        feelsLikeElement.textContent = `${Math.round(currentData.main.feels_like)}°`;
    } else {
        tempElement.textContent = `${Math.round((currentData.main.temp * 9/5) + 32)}°F`;
        feelsLikeElement.textContent = `${Math.round((currentData.main.feels_like * 9/5) + 32)}°`;
    }
}

// Store data when fetching
async function fetchWeatherData(city) {
    try {
        const data = await originalFetchWeatherData(city); // Your existing function
        sessionStorage.setItem('lastWeatherData', JSON.stringify(data));
        return data;
    } catch (error) {
        throw error;
    }
}

// Clear input button functionality
cityInput.addEventListener('input', () => {
    clearInputBtn.classList.toggle('hidden', !cityInput.value);
});

clearInputBtn.addEventListener('click', () => {
    cityInput.value = '';
    clearInputBtn.classList.add('hidden');
    cityInput.focus();
});

// Keyboard support
cityInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        searchWeather();
    }
});

// Expose functions to global scope
window.searchCity = function(city) {
    cityInput.value = city;
    searchWeather();
    recentSearches.classList.add('hidden');
};


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