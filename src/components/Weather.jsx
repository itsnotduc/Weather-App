import React, { useEffect, useRef, useState } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import day_clear_icon from '../assets/day-clear.png';
import night_clear_icon from '../assets/night-clear.png';
import day_cloud_icon from '../assets/day-cloud.png';
import night_cloud_icon from '../assets/night-cloud.png';
import day_rain_icon from '../assets/day-rain.png';
import night_rain_icon from '../assets/night-rain.png';
import humidity_icon from '../assets/humidity.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';

const Weather = () => {
    const allIcons = {
        "01d": day_clear_icon,
        "01n": night_clear_icon,
        "02d": day_cloud_icon,
        "02n": night_cloud_icon,
        "03d": day_cloud_icon,
        "03n": night_cloud_icon,
        "04d": day_rain_icon,
        "04n": night_rain_icon,
        "09d": day_rain_icon,
        "09n": night_rain_icon,
        "10d": day_rain_icon,
        "10n": night_rain_icon,
        "13d": snow_icon,
        "13n": snow_icon,
    };

    const inputRef = useRef();
    const [weatherData, setWeatherData] = useState({});
    const [suggestions, setSuggestions] = useState([]);
    const [isRaining, setIsRaining] = useState(false);
    const droplets = 250;

    // Function to fetch weather data
    const fetchWeatherData = async (city) => {
        if (city === "") {
            alert("Enter City Name!");
            return;
        }
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
            const response = await fetch(url);
            const data = await response.json();
            console.log(data);
            const icon = allIcons[data.weather[0].icon] || day_clear_icon;
            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                icon: icon,
            });
            setIsRaining(data.weather[0].main.toLowerCase() === 'rain'); // Check if it's raining
        } catch (error) {
            setWeatherData(false);
            console.error("Error fetching weather data:", error);
        }
    };

    // Function to fetch city suggestions
    const fetchCitySuggestions = async (name) => {
        if (name.length < 3) {
            setSuggestions([]); // Clear suggestions if input is less than 3 characters
            return;
        }
        try {
            const url = `https://api.api-ninjas.com/v1/city?name=${name}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'X-Api-Key': import.meta.env.VITE_API_NINJA_KEY // Add your API key here
                }
            });
            const data = await response.json();
            setSuggestions(data); // Set suggestions based on the fetched data
        } catch (error) {
            console.error("Error fetching city suggestions:", error);
        }
    };

    // Handle Enter key press
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            fetchWeatherData(inputRef.current.value);
            setSuggestions([]); // Clear suggestions after selecting a city
        }
    };

    // Handle input change
    const handleInputChange = (event) => {
        const value = event.target.value;
        inputRef.current.value = value; // Update input value
        fetchCitySuggestions(value); // Fetch city suggestions
    };

    // Select a city from suggestions
    const handleSuggestionClick = (city) => {
        inputRef.current.value = city.name; // Set input value to the selected city name
        fetchWeatherData(city.name); // Fetch weather data for the selected city
        setSuggestions([]); // Clear suggestions
    };

    return (
        <div className="weather flex flex-col items-center p-10 rounded-2xl bg-gradient-to-br from-blue-800 to-purple-600 w-[1700px] h-[800px] relative">
            {/* Raindrop Animation */}
            {isRaining && (
                <div className="rain">
                    {[...Array(droplets)].map((_, r) => (
                        <svg key={r} className="rain__drop" preserveAspectRatio="xMinYMin" viewBox='0 0 5 50' style={{
                            '--x': Math.floor(Math.random() * 100),
                            '--y': Math.floor(Math.random() * 100),
                            '--o': Math.random(),
                            '--a': Math.random() + 0.5,
                            '--d': (Math.random() * 2) - 1,
                            '--s': Math.random()
                        }}>
                            <path stroke='none' d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z" />
                        </svg>
                    ))}
                </div>
            )}

            <div className="search-bar flex flex-col items-center gap-3">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder='Search city...'
                    onKeyDown={handleKeyDown}
                    onChange={handleInputChange}
                    className="h-12 border-none outline-none rounded-full pl-6 text-gray-600 bg-[#ebfffc] text-lg"
                />
                <img
                    src={search_icon}
                    alt="Search icon"
                    onClick={() => {
                        fetchWeatherData(inputRef.current.value);
                        setSuggestions([]);
                    }}
                    className="w-12 p-3 rounded-full bg-[#ebfffc] cursor-pointer"
                />
                {/* Suggestions Dropdown */}
                {suggestions.length > 0 && (
                    <ul className="suggestions-list bg-white rounded-md shadow-lg w-full mt-2 max-h-40 overflow-y-auto">
                        {suggestions.map((city, index) => (
                            <li key={index} className="suggestion-item cursor-pointer hover:bg-gray-200 p-2" onClick={() => handleSuggestionClick(city)}>
                                {city.name}, {city.state} - {city.country} {/* Adjust as necessary */}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {weatherData && (
                <>
                    <img src={weatherData.icon || day_clear_icon} alt="Weather icon" className='weather-icon w-36 my-8' />
                    <p className='temperature text-white text-8xl leading-none'>{weatherData.temperature ? `${weatherData.temperature}°C` : "--"}</p>
                    <p className='location text-white text-4xl'>{weatherData.location || "Location not found"}</p>

                    <div className='weather-data w-full mt-10 text-white flex justify-between'>
                        <div className='col flex items-start gap-3 text-2xl'>
                            <img src={humidity_icon} alt="Humidity icon" />
                            <div>
                                <p>{weatherData.humidity !== undefined ? `${weatherData.humidity}%` : "--"}</p>
                                <span className="block text-base">Humidity</span>
                            </div>
                        </div>

                        <div className='col flex items-start gap-3 text-2xl'>
                            <img src={wind_icon} alt="Wind icon" />
                            <div>
                                <p>{weatherData.windSpeed !== undefined ? `${weatherData.windSpeed} Km/h` : "--"}</p>
                                <span className="block text-base">Wind Speed</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Weather;
