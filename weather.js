var locationElement = document.querySelector("#location");
let dateElement = document.querySelector("#date");
let timeElement = document.querySelector("#time");
let summaryElement = document.querySelector("#summary");
let currentTempElement = document.querySelector("#currentTemp");
let feelsLikeElement = document.querySelector("#feelsLike");
let humidityElement = document.querySelector("#humidity");
let windsElement = document.querySelector("#winds");
let dailyForecastElement = document.querySelector("#dailyForecast");
let weeklyForecastElement = document.querySelector("#weeklyForecast");

let todaysDate = new Date().toDateString();
let currentTime = new Date().toLocaleTimeString();
dateElement.innerHTML = `${todaysDate} ${currentTime}`;

if('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(getAllWeather, showError);
  } else {
    alert("Location is not available");
  }

function showError(error){
    alert(error.message);
}

function getAllWeather(position){
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    getCurrentWeather(latitude, longitude); 
    getForecast(latitude, longitude);
}


function getCurrentWeather(latitude, longitude) {
    let currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${key}`
    fetch(currentWeatherUrl)
    .then(response => response.json())
    .then(data => {
        locationElement.innerHTML = data.name;
        summaryElement.innerHTML = data.weather[0].description;
        currentTempElement.innerHTML = `${Math.round(data.main.temp)}°`;
        feelsLikeElement.innerHTML = `Feels like ${Math.round(data.main.feels_like)}°`;
        humidityElement.innerHTML = `Humidity ${data.main.humidity}%`;
        windsElement.innerHTML = `Wind ${Math.round(data.wind.speed)}mph`;
    })
    .catch(error => alert(error));
}


function getForecast(latitude, longitude) {
    let forecastWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${key}`;
    let forecastData = [];
    let fiveDayForecastData = [];

    fetch(forecastWeatherUrl)
    .then(response => response.json())
    .then(data => {
        forecastData = data.list;

        for (i = 0; i < forecastData.length; i++) {
            if(i % 8 === 0 ) {
                fiveDayForecastData.push(forecastData[i]);
            }
        }
        console.log(fiveDayForecastData);
        weeklyForecastElement.innerHTML = renderWeeklyForecast(fiveDayForecastData);
    })
    .catch(error => alert(error));
}

function renderWeeklyForecast(data) {
    let resultsHTML = "<tr><th>Day</th><th>Conditions</th><th>Hi</th><th>Lo</th></tr>";
    console.log(data);
    for (i = 0; i < data.length; i++) {

        let date = new Date(data[i].dt * 1000);
        let days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
        let dayName = days[date.getDay()];
        let summary = data[i].weather[0].description;
        let tempHigh = data[i].main.temp_max;
        let tempLow = data[i].main.temp_min;

        resultsHTML += renderRow(dayName, summary, tempHigh, tempLow);
    }

    return resultsHTML;
}

function renderRow(dayName, summary, tempHigh, tempLow) {
    return `<tr><td>${dayName}</td><td>${summary}</td><td>${Math.round(tempHigh)}°</td><td>${Math.round(tempLow)}°</td></tr>`
}


