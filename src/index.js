import "./style.css";
import ScatteredClouds from "./assets/scattered-clouds.jpg";
import ClearNightSky from "./assets/night-clear-sky.jpeg";
import OvercastClouds from "./assets/overcast-clouds.jpg";
import NightOvercastClouds from "./assets/night-overcast-clouds.jpg";
import Rain from "./assets/rain.png";
import Snow from "./assets/snow.jpg";
import ClearSky from "./assets/clear-sky.jpg";
import NightRain from "./assets/night-rain.jpg";
import Mist from "./assets/mist.jpg";
import NightLessClouds from "./assets/night-less-clouds.jpg";

const body = document.querySelector("body");
const form = document.querySelector("form");
const searchCityInput = document.getElementById("search-city");
const searchCityBtn = document.querySelector(".search-city-btn");
const displayTemp = document.querySelector(".temp");
const displayWeather = document.querySelector(".weather");
const displayFeelsLike = document.querySelector(".feels-like");
const displayWind = document.querySelector(".wind");
const displayCity = document.querySelector(".city");
const checkbox = document.getElementById("switch");

async function getGeoCode(city) {
  try {
    const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=8e5a2bde277a03dd82ea3da92c83919c`, { mode: "cors" });
    const geoCode = await response.json();
    const { lat } = geoCode[0];
    const { lon } = geoCode[0];
    return [lat, lon, geoCode];
  } catch (err) {
    console.log(err);
    const cityError = document.createElement("p");
    cityError.textContent = "Location not found.Search must be in the form of 'City', 'City, State' or 'City, Country.'";
    form.appendChild(cityError);
  }
}

async function getData(lat, lon, system) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=8e5a2bde277a03dd82ea3da92c83919c&units=${system}`, { mode: "cors" });
    const data = await response.json();
    const { temp } = data.main;
    const feelsLike = data.main.feels_like;
    const windSpeed = data.wind.speed;
    const weather = data.weather[0].description;
    return {
      temp, weather, feelsLike, windSpeed,
    };
  } catch (err) {
    console.log(err);
  }
}

// checks time and weather
async function checkCondition(city) {
  let currentTime = new Date();
  currentTime = currentTime.getHours();
  const geoCode = await getGeoCode(city);
  const data = await getData(geoCode[0], geoCode[1]);
  const snowPattern = /snow/;
  const rainPattern = /rain/;
  if (currentTime > 6 && currentTime < 21) {
    if (data.weather === "scattered clouds" || data.weather === "few clouds" || data.weather === "broken clouds") {
      body.style.backgroundImage = `url(${ScatteredClouds})`;
    } else if (rainPattern.test(data.weather)) {
      body.style.backgroundImage = `url(${Rain})`;
    } else if (snowPattern.test(data.weather)) {
      body.style.backgroundImage = `url(${Snow})`;
    } else if (data.weather === "clear sky") {
      body.style.backgroundImage = `url(${ClearSky})`;
    } else if (data.weather === "overcast clouds") {
      body.style.backgroundImage = `url(${OvercastClouds})`;
    } else if (data.weather === "mist" || data.weather === "fog" || data.weather === "haze") {
      body.style.backgroundImage = `url(${Mist})`;
    }
  } else if (currentTime >= 21 || currentTime <= 6) {
    if (data.weather === "clear sky") {
      body.style.backgroundImage = `url(${ClearNightSky})`;
    } else if (data.weather === "overcast clouds") {
      body.style.backgroundImage = `url(${NightOvercastClouds})`;
    } else if (snowPattern.test(data.weather)) {
      body.style.backgroundImage = `url(${Snow})`;
    } else if (rainPattern.test(data.weather)) {
      body.style.backgroundImage = `url(${NightRain})`;
    } else if (data.weather === "mist" || data.weather === "fog" || data.weather === "haze") {
      body.style.backgroundImage = `url(${Mist})`;
    } else if (data.weather === "scattered clouds" || data.weather === "few clouds" || data.weather === "broken clouds") {
      body.style.backgroundImage = `url(${NightLessClouds})`;
    }
  }
}

// when site is opened first is loaded this city
async function loadTbilisi() {
  const geoCode = await getGeoCode("tbilisi");
  const data = await getData(geoCode[0], geoCode[1], "metric");
  displayWeather.textContent = `${data.weather}`;
  displayTemp.textContent = `${data.temp} °C`;
  displayFeelsLike.textContent = `Feels Like: ${data.feelsLike} °C`;
  displayWind.textContent = `Wind: ${(data.windSpeed * 3600) / 1000} km/h`;
  // if current time is 7:00 - 19 background is bright
  checkCondition("tbilisi");
}

loadTbilisi();

form.addEventListener("submit", (e) => {
  e.preventDefault();
});

let data;
searchCityBtn.addEventListener("click", async () => {
  const city = searchCityInput.value;
  const geoCode = await getGeoCode(city);
  if (!checkbox.checked) {
    data = await getData(geoCode[0], geoCode[1], "metric");
    displayWind.textContent = `Wind: ${(data.windSpeed * 3600) / 1000} km/h`;
    displayFeelsLike.textContent = `Feels Like: ${data.feelsLike} °C`;
    displayTemp.textContent = `${data.temp} °C`;
  } else {
    data = await getData(geoCode[0], geoCode[1], "imperial");
    displayWind.textContent = `Wind: ${data.windSpeed} m/h`;
    displayFeelsLike.textContent = `Feels Like: ${data.feelsLike} °F`;
    displayTemp.textContent = `${data.temp} °F`;
  }
  displayWeather.textContent = `${data.weather}`;
  displayCity.textContent = geoCode[2][0].name;
  checkCondition(city);
});

checkbox.addEventListener("click", async () => {
  const geoCode = await getGeoCode(displayCity.textContent);
  if (checkbox.checked) {
    data = await getData(geoCode[0], geoCode[1], "imperial");
    displayTemp.textContent = `${data.temp} °F`;
    displayFeelsLike.textContent = `Feels Like: ${data.feelsLike} °F`;
    displayWind.textContent = `Wind: ${data.windSpeed} mph`;
  } else {
    data = await getData(geoCode[0], geoCode[1], "metric");
    displayTemp.textContent = `${data.temp} °C`;
    displayFeelsLike.textContent = `Feels Like: ${data.feelsLike} °C`;
    displayWind.textContent = `Wind: ${(data.windSpeed * 3600) / 1000} km/h`;
  }
});
