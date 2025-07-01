let useCelsius = true;
// API Configuration
const API_KEY = 'ab8725384e84705d0057a0cfe9252707'; // Openweather Actual API Key, may take time to work activate
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
        const response = await fetch(`${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`);
        
        if(!API_KEY || API_KEY.includes('YOUR_API_KEY')) {
      console.warn("Using mock data - API key not active yet");
      return getMockWeather(city);
      }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                errorData.message || 
                `API Error: ${response.status} - ${response.statusText}`
            );
        }
        
        const currentData = await response.json();
        const forecastResponse = await fetch(`${BASE_URL}/forecast?lat=${currentData.coord.lat}&lon=${currentData.coord.lon}&units=metric&appid=${API_KEY}`);
        
        if (!forecastResponse.ok) throw new Error('Failed to load forecast data');
        
        return {
            current: currentData,
            forecast: await forecastResponse.json()
        };
    } catch (error) {
        console.error("Falling back to mock data due to error:", error);
        return getMockWeather(city);
        console.error('API Error:', error);
        throw new Error(`Weather data unavailable. ${error.message}`);
    }
}

// Temporary mock data generator
function getMockWeather(city) {
  const mockCities = {
    "Delhi": {
      coord: { lat: 28.61, lon: 77.23 },
      weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }],
      main: {
        temp: 32,
        feels_like: 34,
        pressure: 1012,
        humidity: 42
      },
      visibility: 5000,
      wind: { speed: 3.1 },
      sys: { 
        country: "IN",
        sunrise: Math.floor(Date.now()/1000) - 21600, // 6 hours ago
        sunset: Math.floor(Date.now()/1000) + 21600  // 6 hours from now
      },
      name: "Delhi"
    }
  };
  
  return {
    current: mockCities[city] || mockCities["Delhi"],
    forecast: {
      list: Array(5).fill().map((_,i) => ({
        dt: Date.now()/1000 + (86400 * i),
        main: {
          temp: 30 + Math.random() * 5,
          feels_like: 32 + Math.random() * 5,
          humidity: 40 + Math.random() * 30,
          pressure: 1010 + Math.random() * 10
        },
        weather: [{
          icon: ["01d","02d","03d","04d","09d","10d","11d","13d"][Math.floor(Math.random()*8)],
          description: ["clear","cloudy","rainy"][Math.floor(Math.random()*3)]
        }],
        wind: { speed: (1 + Math.random() * 5).toFixed(1) }
      }))
    }
  };
}

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

function getCountryFlag(countryCode) {
    return countryCode 
        ? String.fromCodePoint(...[...countryCode.toUpperCase()].map(c => 127397 + c.charCodeAt()))
        : '';
}

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

async function searchWeather() {
    try {
        const city = cityInput.value.trim();
        if (!city) throw new Error('Please enter a city name');
        
        const cachedData = checkNetworkConnection();
        if (cachedData) {
            displayWeatherData(cachedData);
            showError('Offline mode: Showing cached data', 'warning');
            return;
        }
        
        // ... rest of your search logic ...
    } catch (error) {
        showError(error.message);
        console.error('Search error:', error);
    }
}

// Network error detection
function checkNetworkConnection() {
    if (!navigator.onLine) {
        showError('No internet connection. Using last available data.');
        const lastData = sessionStorage.getItem('lastWeatherData');
        if (lastData) return JSON.parse(lastData);
        throw new Error('No cached data available');
    }
    return null;
}

// Get weather by current location
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

// Recent searches dropdown
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
function showError(message, type = 'error') {
    const colors = {
        error: 'bg-red-900/80 border-red-700',
        warning: 'bg-amber-900/80 border-amber-700',
        info: 'bg-blue-900/80 border-blue-700'
    };
    
    errorMessage.innerHTML = `
        <div class="p-3 rounded-lg border ${colors[type]} flex items-start">
            <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'} mt-1 mr-3"></i>
            <div>
                <strong class="font-semibold">${type.toUpperCase()}:</strong>
                <span class="ml-1">${message}</span>
            </div>
            <button onclick="this.parentElement.classList.add('hidden')" class="ml-auto text-sm">
                <i class="fas fa-times"></i>
            </button>
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

window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    showError('An unexpected error occurred. Please refresh the page.');
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

// Add this temporary code to script.js to verify loading
console.log("Script loaded successfully");
console.log("Tailwind loaded:", window.tailwind !== undefined);
console.log("Font Awesome loaded:", window.FontAwesome !== undefined);