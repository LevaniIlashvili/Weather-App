import "./style.css";

const form = document.querySelector("form");
const searchCityInput = document.getElementById("search-city");
const searchCityBtn = document.querySelector(".search-city-btn");
const displayTemp = document.querySelector(".temp");
const displayWeather = document.querySelector(".weather");
const displayFeelsLike = document.querySelector(".feels-like");
const displayWind = document.querySelector(".wind");

async function getGeoCode(city) {
  try {
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=8e5a2bde277a03dd82ea3da92c83919c`, { mode: "cors" });
    const geoCode = await response.json();
    const { lat } = geoCode[0];
    const { lon } = geoCode[0];
    return [lat, lon];
  } catch (err) {
    console.log(err);
  }
}

async function getData(lat, lon) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=8e5a2bde277a03dd82ea3da92c83919c&units=metric`, { mode: "cors" });
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

async function getWeather(city) {
  const geoCode = await getGeoCode(city);
  return getData(geoCode[0], geoCode[1]);
}

// when site is opened first is loaded this city
async function loadTbilisi() {
  const geoCode = await getGeoCode("tbilisi");
  const data = await getData(geoCode[0], geoCode[1]);
  displayTemp.textContent = `Temp: ${data.temp}`;
  displayWeather.textContent = `Weather: ${data.weather}`;
  displayFeelsLike.textContent = `Feels Like: ${data.feelsLike}`;
  displayWind.textContent = `Wind: ${data.windSpeed} km/h`;
}

loadTbilisi();

form.addEventListener("submit", (e) => {
  e.preventDefault();
});

searchCityBtn.addEventListener("click", async () => {
  const city = searchCityInput.value;
  const data = await getWeather(city);
  displayTemp.textContent = `Temp: ${data.temp}`;
  displayWeather.textContent = `Weather: ${data.weather}`;
  displayFeelsLike.textContent = `Feels Like: ${data.feelsLike}`;
  displayWind.textContent = `Wind: ${data.windSpeed} km/h`;
});
