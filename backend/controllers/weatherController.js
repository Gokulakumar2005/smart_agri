import { geocodeLocation, getWeatherForLocation, getSeasonalWeatherForLocation, buildIrrigationRecommendation } from '../services/weatherService.js';

const searchLocations = async (req, res, next) => {
  try {
    const name = String(req.query.name || '').trim();
    if (name.length < 2) {
      return res.status(400).json({ message: 'Enter at least two characters for a location' });
    }

    const locations = await geocodeLocation(name);
    res.json({ locations });
  } catch (error) {
    next(error);
  }
};

const getWeather = async (req, res, next) => {
  try {
    const lat = Number(req.query.lat);
    const lon = Number(req.query.lon);

    if (!lat || !lon) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const weatherData = await getWeatherForLocation(lat, lon);
    const irrigationRecommendation = buildIrrigationRecommendation(weatherData);

    res.json({
      provider: weatherData.provider,
      current: weatherData.current,
      forecast: weatherData.forecast,
      irrigationRecommendation,
    });
  } catch (error) {
    next(error);
  }
};

const getSeasonalWeather = async (req, res, next) => {
  try {
    const lat = Number(req.query.lat);
    const lon = Number(req.query.lon);

    if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return res.status(400).json({ message: 'Valid latitude and longitude are required' });
    }

    const forecast = await getSeasonalWeatherForLocation(lat, lon);
    res.json({ provider: 'open-meteo-seasonal', forecast });
  } catch (error) {
    next(error);
  }
};

export { searchLocations, getWeather, getSeasonalWeather };
