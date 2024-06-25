// Global Variables
const searchButton = document.getElementById("searchBtn");
const searchBar = document.getElementById("searchBar");
let geoLat = 0;
let geoLon = 0;
let newData = {};
let forecast = [];
let current = {};
let locationInfo = {};
const todayDate = document.getElementById("todayDate");
const todayDay = document.getElementById("todayDay");
const tomorrowDay = document.getElementById("tomorrowDay");
const afterTomorrowDay = document.getElementById("afterTomorrowDay");
const todayDegree = document.getElementById("todayDegree");
const tomorrowLDegree = document.getElementById("tomorrowLDegree");
const tomorrowHDegree = document.getElementById("tomorrowHDegree");
const afterTomorrowLDegree = document.getElementById("afterTomorrowLDegree");
const afterTomorrowHDegree = document.getElementById("afterTomorrowHDegree");
const todayIcon = document.getElementById("todayIcon");
const tomorrowIcon = document.getElementById("tomorrowIcon");
const afterTomorrowIcon = document.getElementById("afterTomorrowIcon");
const todayWeather = document.getElementById("todayWeather");
const tomorrowWeather = document.getElementById("tomorrowWeather");
const afterTomorrowWeather = document.getElementById("afterTomorrowWeather");
const rain = document.getElementById("rain");
const wind = document.getElementById("wind");
const direction = document.getElementById("direction");
const city = document.getElementById("city");
const loading = document.querySelector(".loading");

//Functions
searchButton.addEventListener("click", function () {
  initLocation(searchBar.value);;
});

async function initLocation(searchKeyword) {
  try {
    loading.classList.remove("d-none");
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=08e06a3688dd4585be133144242006&q=${searchKeyword}&days=3`
    );

    const data = await response.json();

    newData = data;
    forecast = newData.forecast.forecastday;
    current = newData.current;
    locationInfo = newData.location;
    displayData();
  } catch (error) {
    alert("Please Enter a valid city name.");
  } finally {
    loading.classList.add("d-none");
  }
}

async function currentLocation() {
  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=08e06a3688dd4585be133144242006&q=${geoLat},${geoLon}&days=3`
  );

  const data = await response.json();

  newData = data;
  forecast = newData.forecast.forecastday;
  current = newData.current;
  locationInfo = newData.location;
  displayData();
}

function savePosition(pos) {
  geoLat = pos.coords.latitude;
  geoLon = pos.coords.longitude;
  currentLocation();
}

function displayData() {
  //display City
  city.innerHTML = locationInfo.name;
  //display Date
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayName = [];
  const dayDate = [];
  for (let index = 0; index < forecast.length; index++) {
    const temp = new Date(forecast[index].date);
    dayName[index] = days[temp.getDay()];
    dayDate[index] = `${temp.getDate()} ${
      months[temp.getMonth()]
    } ${temp.getFullYear()}`;
  }
  todayDate.innerHTML = dayDate[0];
  todayDay.innerHTML = dayName[0];
  tomorrowDay.innerHTML = dayName[1];
  afterTomorrowDay.innerHTML = dayName[2];

  //display Temperatures
  todayDegree.innerHTML = `${current.temp_c}<sup>o</sup>C`;
  tomorrowLDegree.innerHTML = `${forecast[1].day.mintemp_c}<sup>o</sup>C`;
  tomorrowHDegree.innerHTML = `${forecast[1].day.maxtemp_c}<sup>o</sup>C`;
  afterTomorrowLDegree.innerHTML = `${forecast[2].day.mintemp_c}<sup>o</sup>C`;
  afterTomorrowHDegree.innerHTML = `${forecast[2].day.maxtemp_c}<sup>o</sup>C`;

  //display Weather Conditions
  //?Icons
  todayIcon.setAttribute("src", `https:${forecast[0].day.condition.icon}`);
  tomorrowIcon.setAttribute("src", `https:${forecast[1].day.condition.icon}`);
  afterTomorrowIcon.setAttribute(
    "src",
    `https:${forecast[2].day.condition.icon}`
  );

  //?Weather
  todayWeather.innerHTML = forecast[0].day.condition.text;
  tomorrowWeather.innerHTML = forecast[1].day.condition.text;
  afterTomorrowWeather.innerHTML = forecast[2].day.condition.text;

  //?Rain, Wind and Direction
  rain.innerHTML = `${forecast[0].day.daily_chance_of_rain}%`;
  wind.innerHTML = current.wind_kph;
  switch (current.wind_dir) {
    case "W":
      direction.innerHTML = "West";
      break;
    case "E":
      direction.innerHTML = "East";
      break;
    case "S":
      direction.innerHTML = "South";
      break;
    case "N":
      direction.innerHTML = "North";
      break;
    default:
      direction.innerHTML = current.wind_dir;
      break;
  }
}

// Main code
initLocation("cairo");

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(savePosition);
} else {
  alert("Geolocation is not supported by this browser.");
}
