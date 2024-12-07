// script.js

const apiKey = "f1e71ab85e803b8cba2d1a1faec30b9f"; 
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("city");
const cityName = document.getElementById("cityName");
const currentWeather = document.getElementById("currentWeather");
const currentTemp = document.getElementById("currentTemp");
const forecastContainer = document.getElementById("forecast");

const getWeatherData = async (city) => {
    try {
        // Fetch current weather
        const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        );
        const weatherData = await weatherResponse.json();

        if (weatherData.cod !== 200) {
            alert("City not found!");
            return;
        }

        // Update current weather info
        cityName.textContent = weatherData.name;
        currentWeather.textContent = `Weather: ${weatherData.weather[0].description}`;
        currentTemp.textContent = `Temperature: ${weatherData.main.temp}°C`;

        // Change background based on weather condition
        const weatherMain = weatherData.weather[0].main.toLowerCase();
        if (weatherMain.includes("cloud")) {
            document.body.style.backgroundImage = "url('cloud.jpeg')";
        } else if (weatherMain.includes("rain")) {
            document.body.style.backgroundImage = "url('rainy.jpeg')";
        } else if (weatherMain.includes("clear")) {
            document.body.style.backgroundImage = "url('sunny.jpeg')";
        } else {
            document.body.style.backgroundImage = "url('default.jpeg')";
        }

        // Fetch 5-day forecast
        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
        );
        const forecastData = await forecastResponse.json();
        displayForecast(forecastData);
    } catch (error) {
        alert("Error fetching data!");
    }
};

const displayForecast = (data) => {
    forecastContainer.innerHTML = "";
    const dailyData = data.list.filter((item) => item.dt_txt.includes("12:00:00"));

    dailyData.forEach((day) => {
        const forecastItem = document.createElement("div");
        forecastItem.classList.add("forecast-item");
        const date = new Date(day.dt_txt).toLocaleDateString("en-US", { weekday: "long" });
        forecastItem.innerHTML = `
            <p>${date}</p>
            <p>${day.weather[0].description}</p>
            <p>${day.main.temp}°C</p>
        `;
        forecastContainer.appendChild(forecastItem);
    });
};

searchBtn.addEventListener("click", () => {
    const city = cityInput.value;
    if (city) getWeatherData(city);
});
