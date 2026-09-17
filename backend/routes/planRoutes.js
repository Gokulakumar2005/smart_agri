const express = require('express');
const { generatePlan, getMyPlans, getPlanById } = require('../controllers/planController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, generatePlan);
router.get('/', protect, getMyPlans);
router.get('/:id', protect, getPlanById);

module.exports = router;
