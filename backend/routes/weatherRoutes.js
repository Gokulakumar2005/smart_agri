import express from 'express';
import { searchLocations, getWeather, getSeasonalWeather } from '../controllers/weatherController.js';

const router = express.Router();

router.get('/', getWeather);
router.get('/geocode', searchLocations);
router.get('/seasonal', getSeasonalWeather);

export default router;
