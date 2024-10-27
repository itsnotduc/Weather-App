import React, { useEffect, useState, useRef } from 'react';
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
import placeholder_flag from '../assets/placeholder.png'; // Add a placeholder image

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
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [weatherData, setWeatherData] = useState({});
    const debounceTimeout = useRef(null);

    const fetchCitySuggestions = async (query) => {
        if (!query) {
            setSuggestions([]);
            return;
        }
        try {
            const url = `https://api.api-ninjas.com/v1/city?name=${query}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'X-Api-Key': import.meta.env.VITE_API_NINJAS_KEY
                }
            });
            const data = await response.json();

            const filteredSuggestions = data.filter(city => city.name.toLowerCase().includes(query.toLowerCase()));
            console.log('Filtered Suggestions:', filteredSuggestions); 
            setSuggestions(filteredSuggestions);
        } catch (error) {
            console.error("Error fetching city suggestions:", error);
        }
    };

    const handleInputChange = (event) => {
        const value = event.target.value;
        setQuery(value);

        clearTimeout(debounceTimeout.current);
        debounceTimeout.current = setTimeout(() => {
            fetchCitySuggestions(value);
        }, 300); 
    };

    const search = async (city) => {
        if (city === "") {
            alert("Enter City Name!");
            return;
        }
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
            const response = await fetch(url);
            const data = await response.json();
            const icon = allIcons[data.weather[0].icon] || day_clear_icon;
            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.round(data.main.temp),
                location: data.name,
                icon: icon
            });
            setSuggestions([]);
        } catch (error) {
            setWeatherData(false);
            console.error("Error fetching weather data:", error);
        }
    };

    const handleCitySelect = (city) => {
        setQuery(city.name);
        search(city.name);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            search(query);
        }
    };

    const getCountryFlagUrl = (countryCode) => {
        return `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`; 
    };

    return (
        <div className='weather'>
            <div className="search-bar" style={{ position: 'relative' }}>
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    placeholder='Search'
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />
                <img src={search_icon} alt="Search icon" onClick={() => search(query)} />
                {suggestions.length > 0 && (
                    <ul className="suggestions-dropdown">
                        {suggestions.map((city, index) => (
                            <li key={index} onClick={() => handleCitySelect(city)}>
                                <span>{city.name}</span>
                                <img
                                    src={getCountryFlagUrl(city.country)}
                                    alt={`${city.country} flag`}
                                    className='country-flag'
                                    onError={(e) => { e.target.src = placeholder_flag; }} // Fallback to placeholder
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {weatherData ? (
                <>
                    <img
                        src={weatherData.icon || day_clear_icon}
                        alt="Weather icon"
                        className='weather-icon'
                    />
                    <p className='temperature'>{weatherData.temperature ? `${weatherData.temperature}°C` : "--"}</p>
                    <p className='location'>{weatherData.location || "Location not found"}</p>

                    <div className='weather-data'>
                        <div className='col'>
                            <img src={humidity_icon} alt="Humidity icon" />
                            <div>
                                <p>{weatherData.humidity !== undefined ? `${weatherData.humidity}%` : "--"}</p>
                                <span>Humidity</span>
                            </div>
                        </div>

                        <div className='col'>
                            <img src={wind_icon} alt="Wind icon" />
                            <div>
                                <p>{weatherData.windSpeed !== undefined ? `${weatherData.windSpeed} Km/h` : "--"}</p>
                                <span>Wind Speed</span>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
};

export default Weather;
