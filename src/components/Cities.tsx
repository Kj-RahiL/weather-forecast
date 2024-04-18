import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Define interfaces for city and weather data
interface City {
  name: string;
  country: string;
  timezone: string;
}

interface Weather {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
}

const App: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);

  useEffect(() => {
    // Fetch city data from the provided API
    axios.get('https://public.opendatasoft.com/explore/dataset/geonames-all-cities-with-a-population-1000/api/')
      .then(response => {
        setCities(response.data);
      })
      .catch(error => {
        console.error('Error fetching city data:', error);
      });
  }, []);

  const handleCityClick = (cityName: string) => {
    // Fetch weather data for the selected city
    axios.get(`https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=20`)
      .then(response => {
        const weatherData: Weather = {
          temperature: response.data.main.temp,
          description: response.data.weather[0].description,
          humidity: response.data.main.humidity,
          windSpeed: response.data.wind.speed,
          pressure: response.data.main.pressure
        };
        setWeather(weatherData);
        setSelectedCity(cityName);
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
      });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <input type="text" placeholder="Search cities..." value={searchTerm} onChange={handleSearchChange} />
      <table>
        <thead>
          <tr>
            <th>City Name</th>
            <th>Country</th>
            <th>Timezone</th>
          </tr>
        </thead>
        <tbody>
          {filteredCities.map(city => (
            <tr key={city.name}>
              <td onClick={() => handleCityClick(city.name)}>{city.name}</td>
              <td>{city.country}</td>
              <td>{city.timezone}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedCity && weather && (
        <div>
          <h2>{selectedCity}</h2>
          <p>Temperature: {weather.temperature}°C</p>
          <p>Description: {weather.description}</p>
          <p>Humidity: {weather.humidity}%</p>
          <p>Wind Speed: {weather.windSpeed} m/s</p>
          <p>Pressure: {weather.pressure} hPa</p>
        </div>
      )}
    </div>
  );
};

export default App;
