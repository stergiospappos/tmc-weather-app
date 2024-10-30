// Combined mychart.js and script.js
const apiKey = "3909ccc8117eb7de01eae80ab6e2818e";

let morningTempCelsius = null;
let afternoonTempCelsius = null;
let eveningTempCelsius = null;
let nightTempCelsius = null;
const milliSecondConverter = 1000;

// Error Toast Notification
let toastTime;
let toast = document.getElementById("toast");
let overlay = document.getElementById("overlay");

function showToast() {
  clearTimeout(toastTime);
  toast.style.top = "50px";
  overlay.style.display = "block";
  overlay.style.opacity = "1";
  overlay.style.pointerEvents = "all";
  toastTime = setTimeout(() => {
    closeToast();
  }, 4000);
}

function closeToast() {
  toast.style.top = "-100px";
  overlay.style.opacity = "0";
  overlay.style.pointerEvents = "none";
  overlay.style.display = "none";
}

// Unified fetchWeather function
async function fetchWeather(city) {
  try {
    let defaultCity = "Dubai,AE";
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${
      city || defaultCity
    }&appid=${apiKey}`;
    let result = await fetch(url);
    let data = await result.json();
    showWeather(data);
    console.log(data);
    return data;
  } catch (error) {
    showToast();
  }
}

// Show Weather Function with temperature segments
function showWeather(weatherData) {
  const tempCelsius = (weatherData.list[0].main.temp - 273.15).toFixed(0);
  document.querySelector(".temperature").innerHTML = `${tempCelsius}°C`;

  let startIndex = weatherData.list.findIndex((entry) =>
    entry.dt_txt.endsWith("09:00:00")
  );

  if (startIndex !== -1) {
    morningTempCelsius = (
      weatherData.list[startIndex].main.temp - 273.15
    ).toFixed(0);
    for (let i = startIndex + 1; i < weatherData.list.length; i++) {
      let entry = weatherData.list[i];
      if (entry.dt_txt.endsWith("15:00:00") && afternoonTempCelsius === null) {
        afternoonTempCelsius = (entry.main.temp - 273.15).toFixed(0);
      }
      if (entry.dt_txt.endsWith("18:00:00") && eveningTempCelsius === null) {
        eveningTempCelsius = (entry.main.temp - 273.15).toFixed(0);
      }
      if (entry.dt_txt.endsWith("21:00:00") && nightTempCelsius === null) {
        nightTempCelsius = (entry.main.temp - 273.15).toFixed(0);
      }
      if (afternoonTempCelsius && eveningTempCelsius && nightTempCelsius) {
        break;
      }
    }
  }

  // Additional weather information display
  const wind = weatherData.list[0].wind.speed.toFixed(0);
  document.querySelector(".wind-text").innerHTML = `${wind}km/h`;
  document.querySelector("#windtext2").innerHTML = `${wind}km/h`;
  const humid = weatherData.list[0].main.humidity.toFixed(0);
  document.querySelector(".humidity-text").innerHTML = `${humid}%`;
  document.querySelector("#humidity").innerHTML = `${humid}%`;
  const pressure = weatherData.list[0].main.pressure.toFixed(0);
  document.querySelector("#pressure").innerHTML = `${pressure}hPa`;

  const sunriseUnix = weatherData.city.sunrise;
  const sunriseDate = new Date(sunriseUnix * milliSecondConverter);
  document.querySelector(".sunrise-text").innerHTML =
    sunriseDate.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  const sunsetUnix = weatherData.city.sunset;
  const sunsetDate = new Date(sunsetUnix * milliSecondConverter);
  document.querySelector(".sunset-text").innerHTML =
    sunsetDate.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

  initializeChart();
}

// Initialize Chart with Weather Data
async function initializeChart() {
  const minTemperature = Math.min(
    morningTempCelsius,
    afternoonTempCelsius,
    eveningTempCelsius,
    nightTempCelsius
  );
  const maxTemperature = Math.max(
    morningTempCelsius,
    afternoonTempCelsius,
    eveningTempCelsius,
    nightTempCelsius
  );

  const ctx = document.getElementById("myChart").getContext("2d");
  const myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Morning", "Afternoon", "Evening", "Night"],
      datasets: [
        {
          label: "Temperature",
          data: [
            morningTempCelsius,
            afternoonTempCelsius,
            eveningTempCelsius,
            nightTempCelsius,
          ],
          borderColor: "rgba(255, 255, 255, 0.5)",
          borderWidth: 2,
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          tension: 0.4,
          pointBackgroundColor: "white",
          pointBorderColor: "#BADCFF",
          pointBorderWidth: 5,
          pointRadius: 6,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: "white",
          pointHoverBorderColor: "rgba(255, 255, 255, 1)",
          pointHoverBorderWidth: 4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          grid: { display: false, color: "rgba(255, 255, 255, 0.2)" },
          ticks: { color: "rgba(255, 255, 255, 0.7)", font: { size: 14 } },
        },
        y: {
          display: false,
          min: minTemperature - 1,
          max: maxTemperature + 1,
          ticks: { color: "rgba(255, 255, 255, 0.7)", font: { size: 14 } },
          grid: { color: "rgba(255, 255, 255, 0.2)" },
        },
      },
      layout: { padding: { top: 10, bottom: 10 } },
    },
  });
}

// Event listener for searching a city
document.querySelector(".search-field").addEventListener("change", (e) => {
  const city = e.target.value;
  document.querySelector(".current-city-title").innerHTML = city;
  fetchWeather(city);
});

// Fetch weather data on initial load
fetchWeather();
