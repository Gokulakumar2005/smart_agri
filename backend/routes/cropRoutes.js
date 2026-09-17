const express = require('express');
const { getCrops, getCropById } = require('../controllers/cropController');

const router = express.Router();

router.get('/', getCrops);
router.get('/:id', getCropById);

module.exports = router;
