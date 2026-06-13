const searchBtn =
    document.getElementById("searchBtn");

const cityInput =
    document.getElementById("cityInput");

const weatherCard =
    document.getElementById("weatherCard");

const cityName =
    document.getElementById("cityName");

const temperature =
    document.getElementById("temperature");

const condition =
    document.getElementById("condition");

const humidity =
    document.getElementById("humidity");

const wind =
    document.getElementById("wind");

const loadingText =
    document.getElementById("loadingText");

const errorText =
    document.getElementById("errorText");

const suggestions =
    document.getElementById("suggestions");

searchBtn.addEventListener("click", () => {

    const city =
        cityInput.value.trim();

    if (city === "") {

        errorText.textContent =
            "Please enter a city name";

        weatherCard.style.display =
            "none";

        return;
    }

    getWeather(city);
});

cityInput.addEventListener(
    "keypress",
    (event) => {

        if (
            event.key === "Enter"
        ) {

            searchBtn.click();
        }
    }
);

async function getWeather(city) {

    loadingText.textContent =
        "Loading weather data...";

    errorText.textContent = "";

    weatherCard.style.display =
        "none";

    try {

        const response =
            await fetch(
`https://wttr.in/${city}?format=j1`
            );

        const data =
            await response.json();

        const weather =
            data.current_condition[0];

        cityName.textContent =
            city;

        temperature.textContent =
            `${weather.temp_C}°C`;

        condition.textContent =
            weather.weatherDesc[0].value;

        humidity.textContent =
            `Humidity: ${weather.humidity}%`;

        wind.textContent =
            `Wind Speed: ${weather.windspeedKmph} km/h`;

        weatherCard.style.display =
            "block";
    }

    catch (error) {

        errorText.textContent =
            "Unable to fetch weather data";
    }

    finally {

        loadingText.textContent =
            "";
    }
}
cityInput.addEventListener(
    "input",
    async () => {

        const query =
            cityInput.value.trim();

        suggestions.innerHTML =
            "";

        if (query.length < 2) return;

        try {

            const response =
                await fetch(
`https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5`
                );

            const data =
                await response.json();

            if (!data.results) return;

            data.results.forEach(city => {

                const item =
                    document.createElement(
                        "div"
                    );

                item.classList.add(
                    "suggestion-item"
                );

                item.textContent =
`${city.name}, ${city.country}`;

                item.addEventListener(
                    "click",
                    () => {

                        cityInput.value =
                            city.name;

                        suggestions.innerHTML =
                            "";
                    }
                );

                suggestions.appendChild(
                    item
                );
            });

        }

        catch (error) {

            console.log(error);
        }
    }
);