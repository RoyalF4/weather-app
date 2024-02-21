import './css/reset.css';
import './css/style.css';

const FORECAST_LENGTH = 3;
const API_KEY = '245f101ed3434e6f98903140242102';

const container = document.querySelector('.container');
const form = document.querySelector('form');
const locationInput = document.querySelector('#location');
const inputError = document.querySelector('span.error');
const locationHeading = document.querySelector('#locationHeading');

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

function createForecastContent(forecast) {
  forecast.forEach((day) => {
    const div = document.createElement('div');
    div.classList.add('forecast');
    div.textContent = day.day.condition.text;
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

async function getForecast(location) {
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=${FORECAST_LENGTH}&aqi=no&alerts=no`,
    );
    if (response.status === 400) {
      showError();
      throw new Error('Bad Request!');
    }
    const data = await response.json();
    const locationData = data.location;
    const forecastData = data.forecast.forecastday;
    setLocationText(locationData);
    createForecastContent(forecastData);
  } catch (error) {
    setLocationText();
  }
}

// form.addEventListener('submit', (event) => {
//   event.preventDefault();
//   const formData = new FormData(form);
//   const data = Object.fromEntries(formData);
//   container.textContent = '';
//   getForecast(data.location);
// });

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!locationInput.validity.valid) {
    showError();
  } else {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    container.textContent = '';
    getForecast(data.location);
  }
});
