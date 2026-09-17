import express from 'express';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';
import * as adminController from '../controllers/adminController.js';

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

export default router;
