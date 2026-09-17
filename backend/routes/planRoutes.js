import express from 'express';
import { generatePlan, getMyPlans, getPlanById, updatePlan, deletePlan, toggleTask } from '../controllers/planController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, generatePlan);
router.get('/', protect, getMyPlans);
router.put('/:id', protect, updatePlan);
router.delete('/:id', protect, deletePlan);
router.patch('/:id/tasks/:taskId', protect, toggleTask);
router.get('/:id', protect, getPlanById);

export default router;
