import React, { useEffect, useState, useRef } from 'react';
import './Weather.css';
import './Clouds.css';
import Clouds from './Clouds';
import Rain, { createRaindrops } from './Rain';
import './Rain.css';
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
import placeholder_flag from '../assets/placeholder.png';

const Weather = () => {
    const allIcons = {
        "01d": day_clear_icon,
        "01n": night_clear_icon,
        "02d": day_cloud_icon,
        "02n": night_cloud_icon,
        "03d": day_cloud_icon,
        "03n": night_cloud_icon,
        "04d": day_cloud_icon,
        "04n": night_cloud_icon,
        "09d": day_rain_icon,
        "09n": night_rain_icon,
        "10d": day_rain_icon,
        "10n": night_rain_icon,
        "13d": snow_icon,
        "13n": snow_icon,
    };

    const [weatherData, setWeatherData] = useState({
        humidity: "-- ",
        windSpeed: "-- ",
        temperature: "-- ",
        location: "Location not found",
        icon: day_clear_icon,
        timezoneOffset: 0
    });
    const [background, setBackground] = useState('morning');
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isRaining, setIsRaining] = useState(false);
    const [isCloudy, setIsCloudy] = useState(false);
    const inputRef = useRef();
    const debounceTimeout = useRef(null);
    const dropdownRef = useRef(); 

    useEffect(() => {
        const updateBackground = () => {
            const utcHour = new Date().getUTCHours();
            const localHour = (utcHour + weatherData.timezoneOffset / 3600) % 24;

            if (localHour >= 6 && localHour < 12) {
                setBackground('morning');
            } else if (localHour >= 12 && localHour < 18) {
                setBackground('afternoon');
            } else if (localHour >= 18 && localHour < 20) {
                setBackground('evening');
            } else {
                setBackground('night');
            }
        };

        if (weatherData.timezoneOffset !== undefined) {
            updateBackground();
        }
    }, [weatherData]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !inputRef.current.contains(event.target)) {
                setSuggestions([]);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
                icon: icon,
                timezoneOffset: data.timezone
            });

            const weatherMain = data.weather[0].main.toLowerCase();
            setIsRaining(weatherMain === 'rain' || weatherMain === 'drizzle');
            setIsCloudy(weatherMain === 'clouds');
            setSuggestions([]);
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    };

    const handleCitySelect = (city) => {
        setQuery(city.name);
        search(city.name);
        setSuggestions([]);
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
        <div className={`weather ${background}`} style={{ transition: 'background 2s ease-in-out' }}>
            <div className={`clouds ${isCloudy ? 'visible' : 'hidden'}`}>
                <Clouds />
            </div>
            {isRaining && <div className="rain">{createRaindrops()}</div>}

            <div className="search-container">
                <div className="search-bar">
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        placeholder='Search'
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                    />
                    <img src={search_icon} alt="Search icon" onClick={() => search(query)} />
                </div>
                {suggestions.length > 0 && (
                    <ul className="suggestions-dropdown" ref={dropdownRef}>
                        {suggestions.map((city, index) => (
                            <li key={index} onClick={() => handleCitySelect(city)}>
                                <span>{city.name}</span>
                                <img
                                    src={getCountryFlagUrl(city.country)}
                                    alt={`${city.country} flag`}
                                    className='country-flag'
                                    onError={(e) => { e.target.src = placeholder_flag; }}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {weatherData && weatherData.temperature && (
                <>
                    <img className='weather-icon' src={weatherData.icon} alt="Weather Icon" />
                    <div className="temperature">{weatherData.temperature}°C</div>
                    <div className="location">{weatherData.location}</div>

                    <div className="weather-data">
                        <div className="col">
                            <img src={humidity_icon} alt="Humidity Icon" />
                            <div>{weatherData.humidity}% <span>Humidity</span></div>
                        </div>
                        <div className="col">
                            <img src={wind_icon} alt="Wind Icon" />
                            <div>{weatherData.windSpeed} m/s <span>Wind Speed</span></div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Weather;
