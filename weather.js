var locationElement = document.querySelector("#location");
let dateElement = document.querySelector("#date");
let timeElement = document.querySelector("#time");
let summaryElement = document.querySelector("#summary");
let currentTempElement = document.querySelector("#currentTemp");
let feelsLikeElement = document.querySelector("#feelsLike");
let humidityElement = document.querySelector("#humidity");
let windsElement = document.querySelector("#winds");
let hourlyForecastElement = document.querySelector("#hourlyForecast");
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
    // getCurrentWeather(latitude, longitude); 
    // getForecast(latitude, longitude);
    // getHourlyForecast(latitude, longitude);
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
        weeklyForecastElement.innerHTML = renderWeeklyForecast(fiveDayForecastData);
    })
    .catch(error => alert(error));
}

function getHourlyForecast(latitude, longitude) {
    let hourlyWeatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&appid=${key}`;
    let hourlyForecastData = [];

    fetch(hourlyWeatherUrl)
    .then(response => response.json())
    .then(data => {
        hourlyForecastData = data.hourly;
        hourlyForecastElement.innerHTML = renderHourlyForecast(hourlyForecastData); 
    })
    .catch(error => alert(error));
}

function renderWeeklyForecast(data) {
    let resultsHTML = "<tr><th>Day</th><th>Conditions</th><th>Hi</th><th>Lo</th></tr>";
    for (i = 0; i < data.length; i++) {

        let date = new Date(data[i].dt * 1000);
        let days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
        let dayName = days[date.getDay()];
        let summary = data[i].weather[0].description;
        let tempHigh = `${Math.round(data[i].main.temp_max)}°`;
        let tempLow = `${Math.round(data[i].main.temp_min)}°`;

        resultsHTML += renderRow(dayName, summary, tempHigh, tempLow);
    }

    return resultsHTML;
}

function renderHourlyForecast(data) {
    let resultsHTML = `<tr><th>Time</th><th>Conditions</th><th>Temp</th><th>Humidity</th></tr>`;
 
    for (i = 0; i < 5; i++) {
        
        let time = new Date(data[i].dt * 1000);
        let summary = "";
        let temp = 0;
        let timeValue;

        let hours = time.getHours();
        if (hours > 0 && hours <= 12) {
            timeValue = "" + hours;
        } else if (hours > 12) {
            timeValue = "" + (hours - 12);
        } else if (hours == 0) {
            timeValue = "12";
        }
        timeValue += (hours >= 12) ? " PM" : " AM";

        summary = data[i].weather[0].description;
        temp = `${Math.round(data[i].temp)}°`;
        let humidity = `${Math.round(data[i].humidity)}%`;
        
        resultsHTML += renderRow(timeValue, summary, temp, humidity);
    }
    return resultsHTML;
}


function renderRow(dayTime, summary, temp, column4Value) {
    return `<tr><td>${dayTime}</td><td>${summary}</td><td>${temp}</td><td>${column4Value}</td></tr>`
}



