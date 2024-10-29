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

const apiKey = "3909ccc8117eb7de01eae80ab6e2818e";
let city = "Dubai,AE";
const milliSecondConverter = 1000;

const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

fetch(url)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    return response.json();
  })
  .then((data) => {
    // Store the weather data in a variable
    const weatherData = data;
    console.log(weatherData);
    // Convert temperature from Kelvin to Celsius
    const tempCelsius = (weatherData.main.temp - 273.15).toFixed(0);

    // Show the Celsius temperature in the main panel
    const temperatureContainer = document.querySelector(".temperature");
    temperatureContainer.innerHTML = `${tempCelsius}°C`;

    // Show the Wind in the main panel
    const windtext = document.querySelector(".wind-text");
    const wind = weatherData.wind.speed.toFixed(0);
    windtext.innerHTML = `${wind}km/h`;

    //Show the humidity in the main panel
    const humidtext = document.querySelector(".humidity-text");
    const humid = weatherData.main.humidity.toFixed(0);
    humidtext.innerHTML = `${humid}%`;

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
  })
  .catch((error) => {
    console.error("There has been a problem with your fetch operation:", error);
  });
