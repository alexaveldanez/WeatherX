let locationElement = document.querySelector("#location");
let dateElement = document.querySelector("#date");
let timeElement = document.querySelector("#time");
let summaryElement = document.querySelector("#summary");
let currentTempElement = document.querySelector("#currentTemp");
let weatherIconElement = document.querySelector("#weatherIcon");
let feelsLikeElement = document.querySelector("#feelsLike");
let humidityElement = document.querySelector("#humidity");
let windsElement = document.querySelector("#winds");
let hourlyForecastElement = document.querySelector("#hourlyForecast");
let weeklyForecastElement = document.querySelector("#weeklyForecast");
let currentTempCard = document.querySelector("#wCurrentCard");
let wConditionsElement = document.querySelector("#wConditions");
let wForecastElement = document.querySelector("#wForecast");

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
    getHourlyForecast(latitude, longitude);
}


function getCurrentWeather(latitude, longitude) {
    let currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${key}`
    fetch(currentWeatherUrl)
    .then(response => response.json())
    .then(data => {
        let icon = data.weather[0].icon;
        // setTheme(icon);
        document.body.style.backgroundImage = getBackground(icon);
        locationElement.innerHTML = data.name;
        weatherIconElement.src = getIcon(icon);
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

function getIcon(icon) {
    let selectedIcon;
    switch (icon) {
      case '01d':
        selectedIcon = "images/SunnyDay.png"
        break;
      case '01n':
        selectedIcon = "images/ClearMoon.png"
        break;
      case '02d':
      case '03d':
      case '04d':
        selectedIcon = "images/MostlySunny.png"
        break;
      case '02n':
      case '03n':
      case '04n':
        selectedIcon = "images/CloudyMoon.png"
        break;
      case '09d':
      case '09n':
      case '10d':
      case '10n':
        selectedIcon = "images/rain.png"
        break;
      case '11d':
      case '11n':
        selectedIcon = "images/Thunder.png"
        break;
      case '13d':
      case '13n':
        selectedIcon = "images/snow.png"
        break;
      case '50d':
      case '50n':
        selectedIcon = "images/fog.png"
        break;
      default:
        selectedIcon = "images/SunnyDay.png"
    }
    return selectedIcon;
  }

  function getBackground(icon) {
    let background;
    switch (icon) {
      case '01d':
      case '02d':
      case '03d':
      case '04d':
      case '09d':
      case '10d':
      case '11d':
      case '13d':
      case '50d':
        background = "url('/images/Day.jpg')";
        currentTempCard.id = "wCurrentCard";
        wConditionsElement.id = "wConditions";
        wForecastElement.id = "wForecast";
        break;
      case '01n':
      case '02n':
      case '03n':
      case '04n':
      case '09n':
      case '10n':
      case '11n':
      case '13n':
      case '50n':
        background = "url('/images/Night.jpg')";
        currentTempCard.id = "wCurrentCardNight";
        wConditionsElement.id = "wConditionsNight";
        wForecastElement.id = "wForecastNight";
        break;
      default:
        background = "url(/images/Day.png);"
        currentTempCard.id = "wCurrentCard";
        wConditionsElement.id = "wConditions";
        wForecastElement.id = "wForecast";
    }
    return background;
  }



