const { getWeatherForLocation, buildIrrigationRecommendation } = require('../services/weatherService');

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

module.exports = { getWeather };
