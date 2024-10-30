// API: 3909ccc8117eb7de01eae80ab6e2818e

//Current weather:
//https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}

//Lat & Lon Any
//http://api.openweathermap.org/geo/1.0/direct?q={city}&limit=5&appid={API key}

//Lat & Lon Dubai
//http://api.openweathermap.org/geo/1.0/direct?q=Dubai&limit=5&appid=3909ccc8117eb7de01eae80ab6e2818e

//"lat":25.2653471,"lon":55.2924914,"country":"AE","state":"Dubai"

//Get Dubai weather directly
//https://api.openweathermap.org/data/2.5/weather?lat=25.26&lon=55.29&appid=3909ccc8117eb7de01eae80ab6e2818e

//https://api.openweathermap.org/data/2.5/weather?q=Dubai,AE&appid=3909ccc8117eb7de01eae80ab6e2818e

// const testurl2 = `https://api.openweathermap.org/data/2.5/${type}?q=${
//     city ? city : defaultCity
//   }&appid=${apiKey}`;

//Error Toast Notification
let toastTime;
let toast = document.getElementById("toast");
let overlay = document.getElementById("overlay");

function showToast() {
  clearTimeout(toastTime);
  toast.style.top = "50px"; // Move the toast into view from the top
  overlay.style.display = "block";
  overlay.style.opacity = "1"; // Fade in the overlay
  overlay.style.pointerEvents = "all"; // Enable clicking on overlay to close
  toastTime = setTimeout(() => {
    closeToast(); // Move the toast back out of view
  }, 4000);
}

function closeToast() {
  toast.style.top = "-100px"; // Move the toast out of view
  overlay.style.opacity = "0"; // Fade out the overlay
  overlay.style.pointerEvents = "none"; // Disable overlay interactions
  overlay.style.display = "none";
}

const apiKey = "3909ccc8117eb7de01eae80ab6e2818e";
const milliSecondConverter = 1000;

//fetch the api data function
async function fetchWeather(city, type) {
  try {
    let defaultCity = "Dubai,AE";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${
      city ? city : defaultCity
    }&appid=${apiKey}`;

    let result = await fetch(url);
    let data = await result.json();

    //Show Weather Function
    showWeather(data);
    console.log(data);
    return data;
  } catch (error) {
    showToast();
  }
}

fetchWeather();

//Add Data to the HTML
function showWeather(weatherData) {
  // Convert temperature from Kelvin to Celsius
  const tempCelsius = (weatherData.main.temp - 273.15).toFixed(0);

  // Show the Celsius temperature in the main panel
  const temperatureContainer = document.querySelector(".temperature");
  temperatureContainer.innerHTML = `${tempCelsius}°C`;

  // Show the Wind in the main panel
  const windtext = document.querySelector(".wind-text");
  const windetext2 = document.querySelector("#windtext2");
  const wind = weatherData.wind.speed.toFixed(0);
  windtext.innerHTML = `${wind}km/h`;
  windetext2.innerHTML = `${wind}km/h`;

  //Show the humidity in the main panel
  const humidtext = document.querySelector(".humidity-text");
  const humidtext2 = document.querySelector("#humidity");
  const humid = weatherData.main.humidity.toFixed(0);
  humidtext.innerHTML = `${humid}%`;
  humidtext2.innerHTML = `${humid}%`;

  //Show pressure
  const pressureContainer = document.querySelector("#pressure");
  const pressure = weatherData.main.pressure.toFixed(0);
  pressureContainer.innerHTML = `${pressure}hPa`;

  //Show Coordinates

  const coorContainer = document.querySelector("#coordinates");
  const lat = weatherData.coord.lat.toFixed(2);
  const lon = weatherData.coord.lon.toFixed(2);
  coorContainer.innerHTML = `Latitude: ${lat} </br> Longitude:${lat}`;

  //Show the sunrise in the main panel
  const sunriseUnix = weatherData.sys.sunrise;
  const sunriseDate = new Date(sunriseUnix * milliSecondConverter); // Convert to milliseconds
  const sunriseTime = sunriseDate.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const sunrisetext = document.querySelector(".sunrise-text");
  sunrisetext.innerHTML = `${sunriseTime}`;

  //Show the sunrise in the main panel
  const sunsetUnix = weatherData.sys.sunset;
  const sunsetDate = new Date(sunsetUnix * milliSecondConverter); // Convert to milliseconds
  const sunsetTime = sunsetDate.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const sunsetText = document.querySelector(".sunset-text");
  sunsetText.innerHTML = `${sunsetTime}`;
}

//Search Function

const searchInput = document.querySelector(".search-field");
let userInput = "";
searchInput.addEventListener("change", (e) => {
  let city = e.target.value;

  let cityTitle = document.querySelector(".current-city-title");
  console.log(city);
  cityTitle.innerHTML = `${city}`;
  fetchWeather(city);
});
