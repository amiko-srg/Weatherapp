const apiKey = "27d5cb4fc8c37fb5b6af7357d346cb33";
const appLang = "en";

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");

async function getCoordsByCity(city) {
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
        city
    )}&limit=1&appid=${apiKey}`;

    const res = await fetch(geoUrl);
    if (!res.ok) throw new Error("Server bilan aloqa muammosi (geo).");

    const list = await res.json();
    if (!list.length) {
        throw new Error(
            "Shahar topilmadi. Iltimos, aniqroq yozing: masalan, 'Tashkent, UZ'."
        );
    }

    const { name, country, state, lat, lon } = list[0];
    return { name, country, state, lat, lon };
}


async function getWeatherByCity(city) {
    try {
        const place = await getCoordsByCity(city);
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${place.lat}&lon=${place.lon}&appid=${apiKey}&units=metric&lang=${appLang}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Ob-havo topilmadi.");

        const data = await res.json();
        showWeather(data, place);
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

function showWeather(data, place) {
    const cityNameEl = document.getElementById("cityName");
    const tempEl = document.getElementById("temperature");
    const rangeEl = document.getElementById("tempRange");
    const iconEl = document.getElementById("weatherIcon");

    const niceName = [place.name, place.state, place.country]
        .filter(Boolean)
        .join(", ");

    cityNameEl.textContent = niceName;
    tempEl.textContent = Math.round(data.main.temp) + "°";
    rangeEl.textContent = `Max: ${Math.round(data.main.temp_max)
        }° Min: ${Math.round(data.main.temp_min)}°`;

    const iconCode = data.weather?.[0]?.icon || "01d";
    iconEl.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    iconEl.alt = data.weather?.[0]?.description || "Weather";
}

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherByCity(city);
    } else {
        alert("Iltimos, shahar nomini yozing.");
    }
});
