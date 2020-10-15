// SELECT ELEMENTS
let locationValue = document.getElementById("location");
let dayTimeValue = document.getElementById("dayTime");
let summaryValue = document.getElementById("summary");
let currentTempValue = document.getElementById("currentTemp");
let precipitationValue = document.getElementById("precipitation");
let humidityValue = document.getElementById("humidity");
let windsValue = document.getElementById("winds");
let warningsValue = document.getElementById("warnings");

// API KEY - Figure out how to hide it in keys.js
const key = "";

// getCurrentLocation
navigator.geolocation.getCurrentPosition(getAllWeather, showError);

// Set user's position

function showError(error){
    console.log(error.message);
}

// get CurrentWeather
function getCurrentWeather(latitude, longitude) {
    let currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${key}`;
    console.log(currentWeatherUrl);

    fetch(currentWeatherUrl)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error));
}

// get Forecast
function getForecast(latitude, longitude) {
    let currentWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${key}`;
    console.log(currentWeatherUrl);

    fetch(currentWeatherUrl)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error));
}

// Invoke functions
function getAllWeather(position){
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    // getCurrentWeather(latitude, longitude);
    getForecast(latitude, longitude);
}




