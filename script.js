const temperatureUnit = "celsius";
const windUnit = "kmh";
const precipitationUnit = "mm";

const timeUrl =
  "https://timeapi.io/api/Time/current/zone?timeZone=Asia%2FManila";

async function getCurrentTime() {
  try {
    const response = await fetch(timeUrl);

    if (!response.ok) {
      throw new Error("Error while connecting to API");
    }

    const data = await response.json();

    const { hour, minute } = data;

    const currentTime = document.querySelector(".current-time");

    currentTime.textContent = `${hour}:${String(minute).padStart(2, "0")}`;
  } catch (error) {
    console.error(error);
  }
}

function formatTemperature(value) {
  if (temperatureUnit === "celsius") {
    return `${Math.round(value)}°C`;
  }

  if (temperatureUnit === "fahrenheit") {
    const fahrenheit = (value * 9) / 5 + 32;
    return `${Math.round(fahrenheit)}°F`;
  }
}

function formatWind(value) {
  if (windUnit === "kmh") {
    return `${Math.round(value)} km/h`;
  }

  if (windUnit === "mph") {
    const mph = value * 0.621371;
    return `${Math.round(mph)} mph`;
  }
}

function formatPrecipitation(value) {
  if (precipitationUnit === "mm") {
    return `${value} mm`;
  }

  if (precipitationUnit === "inch") {
    const inches = value * 0.0393701;
    return `${inches.toFixed(2)} in`;
  }
}

function getWeatherCondition(code) {
  if (code === 0) {
    return "Clear Sky";
  }

  if (code >= 1 && code <= 3) {
    return "Cloudy";
  }

  if (code >= 45 && code <= 48) {
    return "Fog";
  }

  if (code >= 51 && code <= 57) {
    return "Drizzle";
  }

  if (code >= 61 && code <= 67) {
    return "Rain";
  }

  if (code >= 71 && code <= 77) {
    return "Snow";
  }

  if (code >= 80 && code <= 82) {
    return "Rain Showers";
  }

  if (code >= 85 && code <= 86) {
    return "Snow Showers";
  }

  if (code === 95) {
    return "Thunderstorm";
  }

  if (code >= 96 && code <= 99) {
    return "Thunderstorm with Hail";
  }

  return "Unknown";
}
let continent = "Asia";

let city = "Paniqui";


let cityV = "Paniqui";




const cityName = document.querySelector('.city-name')
const CcityName = document.querySelector('.city-name-')
cityName.textContent = cityV;
CcityName.textContent = cityV;

let timezone = `${continent}/${city}`;

const geoApi =
  "https://geocoding-api.open-meteo.com/v1/search" +
  `?name=${cityV}` +
  "&count=1";

let latitude;
let longitude;

async function getLoc() {
  try {
    const response = await fetch(geoApi);

    if (!response.ok) {
      throw new Error("error");
    }

    const data = await response.json();

    ({ latitude, longitude } = data.results[0]);
  } catch (error) {
    console.error(error);
  }
}

getLoc().then(() => {
  const air =
    "https://air-quality-api.open-meteo.com/v1/air-quality" +
    `?latitude=${latitude}` +
    `&longitude=${longitude}` +
    "&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi" +
    "&hourly=pm10,pm2_5,us_aqi" +
    `&timezone=${encodeURIComponent(timezone)}`;

  const weatherUrl =
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${latitude}` +
    `&longitude=${longitude}` +
    "&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m" +
    "&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,weather_code,cloud_cover,visibility,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index" +
    "&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,daylight_duration,sunshine_duration,precipitation_sum,rain_sum,showers_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,uv_index_max" +
    `&timezone=${encodeURIComponent(timezone)}` +
    "&forecast_days=6";

  async function getCurrentWeather() {
    try {
      const response = await fetch(weatherUrl);

      if (!response.ok) {
        throw new Error("Error while connecting to weather API");
      }

      const data = await response.json();

      const {
        current: {
          wind_direction_10m,
          apparent_temperature,
          temperature_2m,
          wind_speed_10m,
          relative_humidity_2m,
          precipitation,
          weather_code,
        },
        daily: {
          time: dailyTime,
          temperature_2m_max,
          weather_code: dailyWeatherCode,
        },
        hourly: {
          time: hourlyTime,
          temperature_2m: hourlyTemperature,
          wind_speed_10m: hourlyWind,
        },
      } = data;
      console.log(data);

      const tempV = document.querySelector(".tempV");
      const feelsLike = document.querySelector(".feelslike");
      const condition = document.querySelector(".condition");
      const windspeed = document.querySelector(".windspeed");

      tempV.textContent = formatTemperature(temperature_2m);
      feelsLike.textContent = formatTemperature(apparent_temperature);
      condition.textContent = getWeatherCondition(weather_code);
      windspeed.textContent = formatWind(wind_speed_10m);

      const tempValue = document.querySelectorAll(".temp-value");
      const dayValueSpans = document.querySelectorAll(".day-value");
      const dailyCondition = document.querySelectorAll(".weekly .condition");

      dailyTime.forEach((dayValue, index) => {
        const date = new Date(`${dayValue}T00:00:00`);

        const formattedDate = new Intl.DateTimeFormat("en-US", {
          weekday: "long",
        }).format(date);

        tempValue[index].textContent = formatTemperature(
          temperature_2m_max[index],
        );

        dayValueSpans[index].textContent = formattedDate;

        dailyCondition[index].textContent = getWeatherCondition(
          dailyWeatherCode[index],
        );
      });

      const hourValue = document.querySelectorAll(".hour-time");
      const hourlyTemp = document.querySelectorAll(".hour-temperature");
      const hourlyWindValue = document.querySelectorAll(".hour-wind");

      const now = new Date();

      let currentHour = now.getHours();
      let next12 = currentHour + 12;

      const slicedHourlyTime = hourlyTime.slice(currentHour, next12);
      const slicedHourlyTemperature = hourlyTemperature.slice(
        currentHour,
        next12,
      );
      const slicedHourlyWind = hourlyWind.slice(currentHour, next12);

      slicedHourlyTime.forEach((time, index) => {
        const date = new Date(time);

        const formattedHour = new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          hour12: true,
          timeZone: "Asia/Manila",
        }).format(date);

        hourValue[index].textContent = formattedHour;

        hourlyTemp[index].textContent = formatTemperature(
          slicedHourlyTemperature[index],
        );

        hourlyWindValue[index].textContent = formatWind(
          slicedHourlyWind[index],
        );
      });

      const humidityv = document.querySelector(".humid");
      humidityv.textContent = `${relative_humidity_2m}%`;

      const precip = document.querySelector(".precip");
      precip.textContent = `${precipitation}mm`;

      const windDir = document.querySelector(".wind-direction");
      windDir.textContent = `${wind_direction_10m}°`;
    } catch (error) {
      console.error(error);
    }
  }

  getCurrentTime();
  getCurrentWeather();
});
