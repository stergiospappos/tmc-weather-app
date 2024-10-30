const apiKey2 = "3909ccc8117eb7de01eae80ab6e2818e";

let morningTempCelsius = null;
let afternoonTempCelsius = null;
let eveningTempCelsius = null;
let nightTempCelsius = null;

function showWeather(weatherData) {
  // Find the first "09:00:00" entry for the morning
  let startIndex = weatherData.list.findIndex((entry) =>
    entry.dt_txt.endsWith("09:00:00")
  );

  if (startIndex !== -1) {
    // Assign morning temperature
    let morningTemperature = weatherData.list[startIndex].main.temp;
    morningTempCelsius = (morningTemperature - 273.15).toFixed(0);
    console.log("Morning Temperature (Celsius):", morningTempCelsius);

    // Continue from the morning index to find afternoon, evening, and night temperatures
    for (let i = startIndex + 1; i < weatherData.list.length; i++) {
      let entry = weatherData.list[i];

      // Find the next "15:00:00" for afternoon
      if (entry.dt_txt.endsWith("15:00:00") && afternoonTempCelsius === null) {
        let afternoonTemperature = entry.main.temp;
        afternoonTempCelsius = (afternoonTemperature - 273.15).toFixed(0);
        console.log("Afternoon Temperature (Celsius):", afternoonTempCelsius);
      }

      // Find the next "18:00:00" for evening
      if (entry.dt_txt.endsWith("18:00:00") && eveningTempCelsius === null) {
        let eveningTemperature = entry.main.temp;
        eveningTempCelsius = (eveningTemperature - 273.15).toFixed(0);
        console.log("Evening Temperature (Celsius):", eveningTempCelsius);
      }

      // Find the next "21:00:00" for night
      if (entry.dt_txt.endsWith("21:00:00") && nightTempCelsius === null) {
        let nightTemperature = entry.main.temp;
        nightTempCelsius = (nightTemperature - 273.15).toFixed(0);
        console.log("Night Temperature (Celsius):", nightTempCelsius);
      }

      // Break the loop once all times are found
      if (afternoonTempCelsius && eveningTempCelsius && nightTempCelsius) {
        break;
      }
    }
  } else {
    console.log("No 09:00:00 data found.");
  }
}

async function fetchWeather(city) {
  try {
    let defaultCity = "Dubai,AE";
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${
      city ? city : defaultCity
    }&appid=${apiKey2}`;

    let result = await fetch(url);
    let data = await result.json();
    showWeather(data);
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
}

// Initialize chart after data is fetched
async function initializeChart() {
  await fetchWeather(); // Fetch the weather data and set morningTempCelsius

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
          borderColor: "rgba(255, 255, 255, 0.5)", // Light line color
          borderWidth: 2,
          backgroundColor: "rgba(255, 255, 255, 0.2)", // Line fill (if needed)
          tension: 0.4, // Smooth curves for the line

          // Point styling
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
        legend: {
          display: false, // Hide the legend
        },
      },
      scales: {
        x: {
          grid: {
            display: false, // Show vertical grid lines
            color: "rgba(255, 255, 255, 0.2)",
          },
          ticks: {
            color: "rgba(255, 255, 255, 0.7)", // Label color
            font: {
              size: 14,
            },
          },
        },
        y: {
          display: false,
          min: minTemperature - 1, // Slightly below min temperature to give padding
          max: maxTemperature + 1, // Slightly above max temperature for padding
          ticks: {
            color: "rgba(255, 255, 255, 0.7)", // Label color
            font: {
              size: 14,
            },
          },
          grid: {
            color: "rgba(255, 255, 255, 0.2)", // Y-axis grid color
          },
        },
      },
      layout: {
        padding: {
          top: 10,
          bottom: 10,
        },
      },
    },
  });
}

// Run the function to initialize the chart with the fetched data
initializeChart();
