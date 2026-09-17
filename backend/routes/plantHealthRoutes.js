const express = require('express');
const { uploadPlantHealthImage, listReports } = require('../controllers/plantHealthController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/', protect, upload.single('image'), uploadPlantHealthImage);
router.get('/', protect, listReports);

module.exports = router;
