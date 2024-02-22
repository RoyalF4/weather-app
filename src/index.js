import './css/reset.css';
import './css/style.css';
import getDate from './date.js';
import getTemp from './temp.js';

const FORECAST_LENGTH = 3;
const API_KEY = '245f101ed3434e6f98903140242102';

const container = document.querySelector('.container');
const form = document.querySelector('form');
const locationInput = document.querySelector('#location');
const inputError = document.querySelector('span.error');
const locationHeading = document.querySelector('#locationHeading');
const spinner = document.querySelector('.spinner');

function showError() {
  if (locationInput.validity.valueMissing) {
    inputError.textContent = 'Enter the name of a city.';
  } else if (!locationInput.validity.valid) {
    inputError.textContent = 'Input can only contain letters.';
  } else {
    inputError.textContent = 'Not a valid city name.';
  }
  inputError.className = 'error active';
}

locationInput.addEventListener('input', () => {
  if (locationInput.validity.valid) {
    inputError.textContent = '';
    inputError.className = 'error';
  } else {
    showError();
  }
});

function getCondition(data) {
  const div = document.createElement('div');
  div.textContent = data.day.condition.text;
  div.classList.add('condition');
  return div;
}

function getPrecipitation(data) {
  const chanceOfRain = data.day.daily_chance_of_rain;
  const chanceOfSnow = data.day.daily_chance_of_snow;
  const precipitationContainer = document.createElement('div');
  precipitationContainer.classList.add('precipitationContainer');
  const rainPercent = document.createElement('div');
  rainPercent.textContent = `💧 ${chanceOfRain}%`;
  precipitationContainer.appendChild(rainPercent);
  if (chanceOfSnow !== 0) {
    const snowPercent = document.createElement('div');
    snowPercent.textContent = `❄️ ${chanceOfSnow}%`;
    precipitationContainer.appendChild(snowPercent);
  }
  return precipitationContainer;
}

function createForecastContent(forecast, unit) {
  forecast.forEach((day) => {
    const div = document.createElement('div');
    const icon = document.createElement('img');
    icon.classList.add('weatherIcon');
    icon.src = day.day.condition.icon;
    div.classList.add('forecast');
    div.appendChild(icon);
    div.appendChild(getCondition(day));
    div.appendChild(getPrecipitation(day));
    div.appendChild(getTemp(day, unit));
    div.appendChild(getDate(day.date));
    container.appendChild(div);
  });
}

function setLocationText(location) {
  if (location === undefined) {
    locationHeading.textContent = '';
  } else {
    locationHeading.textContent = `${location.name}, ${location.region}`;
  }
}

async function getForecast(location, unit) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=${FORECAST_LENGTH}&aqi=no&alerts=no`,
      { mode: 'cors' },
    );
    if (response.status === 400) {
      showError();
      throw new Error('Bad Request!');
    }
    spinner.classList.toggle('hidden');
    const data = await response.json();
    const locationData = data.location;
    const forecastData = data.forecast.forecastday;
    setLocationText(locationData);
    createForecastContent(forecastData, unit);
  } catch (error) {
    spinner.classList.toggle('hidden');
    setLocationText();
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!locationInput.validity.valid) {
    showError();
  } else {
    spinner.classList.toggle('hidden');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    container.textContent = '';
    getForecast(data.location, data.unit);
  }
});
