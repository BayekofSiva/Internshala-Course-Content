# WeatherSphere - Weather Forecast Application

![App Screenshot](./screenshot.png)

## Features
- Real-time weather data for any city
- 5-day forecast with detailed metrics
- Current location detection
- Temperature unit toggle (°C/°F)
- Offline mode with cached data
- Responsive design for all devices

## Setup Instructions

1. **Get an API Key**
   - Register at [OpenWeatherMap](https://openweathermap.org)
   - Get your free API key

2. **Run the Application**
   ```bash
   # Clone repository
   git clone https://github.com/yourusername/weather-app.git
   
   # Open index.html in browser
   ```

3. **Configuration**
   - Add your API key in `script.js`:
     ```javascript
     const API_KEY = 'your_api_key_here';
     ```

## Technical Details

### File Structure
```
weather-app/
├── index.html          # Main application
├── styles.css          # Custom styles
├── script.js           # Core functionality
└── README.md           # Documentation
```

### Dependencies
- [Tailwind CSS](https://tailwindcss.com) (via CDN)
- [Font Awesome](https://fontawesome.com) (icons)
- [OpenWeatherMap API](https://openweathermap.org/api)

### Error Handling
The app handles:
- Invalid city names
- API failures
- Network issues
- Geolocation errors

## Mock Data Usage
When no API key is provided, the app uses sample data for:
- Delhi, India
- London, UK
- New York, US
