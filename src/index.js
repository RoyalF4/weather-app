import './css/reset.css';
import './css/style.css';

const FORECAST_LENGTH = 3;
const API_KEY = '245f101ed3434e6f98903140242102';
const LOCATION = 'massillon';

const container = document.querySelector('.container');
const form = document.querySelector('form');

async function getForecast(location) {
  const response = await fetch(
    `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=${FORECAST_LENGTH}&aqi=no&alerts=no`,
  );
  const data = await response.json();
  const forecast = data.forecast.forecastday;
  forecast.forEach((day) => {
    const div = document.createElement('div');
    div.classList.add('forecast');
    div.textContent = day.day.condition.text;
    container.appendChild(div);
  });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  container.textContent = '';
  getForecast(data.location);
});
