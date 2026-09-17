const express = require('express');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.use(protect, authorize('admin'));
router.get('/analytics', adminController.getAnalytics);
router.get('/crops', adminController.getCrops);
router.post('/crops', adminController.createCrop);
router.put('/crops/:id', adminController.updateCrop);
router.delete('/crops/:id', adminController.deleteCrop);
router.get('/users', adminController.getUsers);
router.patch('/users/:id/block', adminController.toggleBlockUser);
router.get('/reports', adminController.getReports);
router.patch('/reports/:id/review', adminController.reviewReport);

module.exports = router;
