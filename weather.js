var locationElement = document.querySelector("#location");
let dateElement = document.querySelector("#date");
let timeElement = document.querySelector("#time");
let summaryElement = document.querySelector("#summary");
let currentTempElement = document.querySelector("#currentTemp");
let feelsLikeElement = document.querySelector("#feelsLike");
let humidityElement = document.querySelector("#humidity");
let windsElement = document.querySelector("#winds");


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
}


// get CurrentWeather
function getCurrentWeather(latitude, longitude) {
    let currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${key}`
    fetch(currentWeatherUrl)
    .then(response => response.json())
    .then(data => {
        locationElement.innerHTML = data.name;
        summaryElement.innerHTML = data.weather[0].description;
        currentTempElement.innerHTML = `${Math.trunc(data.main.temp)}°`;
        feelsLikeElement.innerHTML = `Feels like ${Math.trunc(data.main.feels_like)}°`;
        humidityElement.innerHTML = `Humidity ${data.main.humidity}%`;
        windsElement.innerHTML = `Wind ${Math.trunc(data.wind.speed)}mph`;
        console.log(data);
    })
    .catch(error => alert(error));
}


