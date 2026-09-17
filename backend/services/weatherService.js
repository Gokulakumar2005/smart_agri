const axios = require('axios');

const cache = new Map();
const TTL = 2 * 60 * 60 * 1000;

const getCacheKey = (lat, lon, provider) => `${provider}:${lat}:${lon}`;

const openMeteoWeather = async (lat, lon) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,weather_code,relative_humidity_2m,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&forecast_days=7`;
  const { data } = await axios.get(url, { timeout: 15000 });

  const daily = data.daily;
  const forecast = daily.time.map((date, index) => ({
    date,
    weatherCode: daily.weather_code[index],
    maxTemp: daily.temperature_2m_max[index],
    minTemp: daily.temperature_2m_min[index],
    precipitation: daily.precipitation_sum[index],
  }));

  return {
    provider: 'open-meteo',
    current: {
      temperature: data.current.temperature_2m,
      precipitation: data.current.precipitation,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      weatherCode: data.current.weather_code,
    },
    forecast,
  };
};

const openWeatherMap = async (lat, lon) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw new Error('OpenWeather API key is not configured');
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  const [currentRes, forecastRes] = await Promise.all([
    axios.get(url, { timeout: 15000 }),
    axios.get(forecastUrl, { timeout: 15000 }),
  ]);

  const forecast = forecastRes.data.list.slice(0, 7).map((entry) => ({
    date: entry.dt_txt.split(' ')[0],
    maxTemp: entry.main.temp_max,
    minTemp: entry.main.temp_min,
    precipitation: entry.rain ? entry.rain['3h'] || 0 : 0,
    weatherCode: entry.weather[0].id,
  }));

  return {
    provider: 'openweathermap',
    current: {
      temperature: currentRes.data.main.temp,
      precipitation: currentRes.data.rain ? currentRes.data.rain['1h'] || 0 : 0,
      humidity: currentRes.data.main.humidity,
      windSpeed: currentRes.data.wind.speed,
      weatherCode: currentRes.data.weather[0].id,
    },
    forecast,
  };
};

const getWeatherForLocation = async (lat, lon) => {
  const provider = process.env.WEATHER_PROVIDER || 'open-meteo';
  const cacheKey = getCacheKey(lat, lon, provider);
  const now = Date.now();

  if (cache.has(cacheKey) && now - cache.get(cacheKey).timestamp < TTL) {
    return cache.get(cacheKey).data;
  }

  try {
    let weatherData;
    if (provider === 'openweathermap') {
      weatherData = await openWeatherMap(lat, lon);
    } else {
      weatherData = await openMeteoWeather(lat, lon);
    }

    cache.set(cacheKey, { timestamp: now, data: weatherData });
    return weatherData;
  } catch (error) {
    console.error('Preferred weather provider failed:', error.message);
    const fallback = await openMeteoWeather(lat, lon).catch(() => {
      throw new Error('Weather data temporarily unavailable');
    });

    cache.set(cacheKey, { timestamp: now, data: fallback });
    return fallback;
  }
};

const buildIrrigationRecommendation = (weatherData) => {
  const next48 = weatherData.forecast.slice(0, 2);
  const rainChance = next48.reduce((sum, day) => sum + Number(day.precipitation || 0), 0);

  if (rainChance >= 10) {
    return {
      recommendation: 'Delay irrigation by 1-2 days as rain is expected in the next 48 hours.',
      delayDays: 1,
      reason: `Projected rain total: ${rainChance.toFixed(1)} mm over the next 48 hours.`,
    };
  }

  return {
    recommendation: 'Irrigation should continue as scheduled; no significant rain is expected.',
    delayDays: 0,
    reason: 'Minimal rainfall forecasted in the next 48 hours.',
  };
};

module.exports = { getWeatherForLocation, buildIrrigationRecommendation };
