const cityInput =
    document.getElementById("cityInput");

const searchBtn =
    document.getElementById("searchBtn");

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

const weatherCard =
    document.getElementById("weatherCard");

const loadingText =
    document.getElementById("loadingText");

const errorText =
    document.getElementById("errorText");

const suggestions =
    document.getElementById("suggestions");

let lat;
let lon;
let timer;



searchBtn.addEventListener(
    "click",
    () => {

        const city =
            cityInput.value.trim();

        if (!city) {

            errorText.textContent =
                "Please enter city name";

            return;
        }

        if (lat && lon) {

            getWeather(
                lat,
                lon,
                city
            );
        }
    }
);



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



async function getWeather(
    latitude,
    longitude,
    city
) {

    loadingText.textContent =
        "Loading weather...";

    errorText.textContent =
        "";

    weatherCard.style.display =
        "none";

    try {

        const response =
            await fetch(
`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
            );

        const data =
            await response.json();

        cityName.textContent =
            city;

        temperature.textContent =
`${data.current.temperature_2m}°C`;

        humidity.textContent =
`Humidity: ${data.current.relative_humidity_2m}%`;

        wind.textContent =
`Wind Speed: ${data.current.wind_speed_10m} km/h`;

        condition.textContent =
            getWeatherCondition(
                data.current.weather_code
            );

        weatherCard.style.display =
            "block";
    }

    catch {

        errorText.textContent =
            "Could not fetch weather";
    }

    loadingText.textContent =
        "";
}



cityInput.addEventListener(
    "input",
    () => {

        clearTimeout(timer);

        timer =
            setTimeout(
                async () => {

                    const query =
                        cityInput.value
                            .trim();

                    suggestions.innerHTML =
                        "";

                    if (
                        query.length < 1
                    ) return;

                    try {

                        const response =
                            await fetch(
`https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=10&language=en`
                            );

                        const data =
                            await response.json();

                        if (
                            !data.results
                        ) return;

                        data.results.forEach(
                            city => {

                                const item =
                                    document.createElement(
                                        "div"
                                    );

                                item.className =
                                    "suggestion-item";

                                item.textContent =
`${city.name}, ${city.admin1 || city.country}`;

                                item.onclick =
                                    () => {

                                        cityInput.value =
                                            city.name;

                                        lat =
                                            city.latitude;

                                        lon =
                                            city.longitude;

                                        suggestions.innerHTML =
                                            "";

                                        getWeather(
                                            lat,
                                            lon,
                                            city.name
                                        );
                                    };

                                suggestions.appendChild(
                                    item
                                );
                            }
                        );

                    }

                    catch {

                        console.log(
                            "Error loading cities"
                        );
                    }

                },
                200
            );
    }
);



function getWeatherCondition(
    code
) {

    if (code === 0)
        return "Clear Sky";

    if (code <= 3)
        return "Cloudy";

    if (code <= 65)
        return "Rainy";

    if (code <= 75)
        return "Snow";

    return "Weather Unavailable";
}