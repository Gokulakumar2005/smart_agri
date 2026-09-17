import express from 'express';
import { uploadPlantHealthImage, listReports } from '../controllers/plantHealthController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/', protect, upload.single('image'), uploadPlantHealthImage);
router.get('/', protect, listReports);

export default router;
