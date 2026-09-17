import Crop from '../models/Crop.js';
import CultivationPlan from '../models/CultivationPlan.js';
import { buildCultivationPlan, buildDailyTasks } from '../services/planGenerator.js';

const escapeRegExp = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getPlanResponse = (plan, crop) => ({
  _id: plan._id,
  cropName: crop.name,
  plantingDate: plan.plantingDate,
  expectedHarvestDate: plan.expectedHarvestDate,
  soilType: plan.soilType,
  irrigationMethod: plan.irrigationMethod,
  farmingPractice: plan.farmingPractice,
  growthDurationDays: crop.growthDurationDays,
  suitabilitySummary: plan.generatedPlan.suitabilitySummary,
  landPreparation: plan.generatedPlan.landPreparation,
  fertilizerSchedule: plan.generatedPlan.fertilizerSchedule,
  irrigationSchedule: plan.generatedPlan.irrigationSchedule,
  maintenanceSchedule: plan.generatedPlan.maintenanceSchedule,
  tasks: plan.tasks || [],
});

const generatePlan = async (req, res, next) => {
  try {
    const { cropName, plantingDate, soilType, irrigationMethod, farmingPractice } = req.body;

    if (!cropName || !plantingDate || !soilType) {
      return res.status(400).json({ message: 'Crop name, planting date and soil type are required' });
    }

    const normalizedCropName = String(cropName).trim();
    const crop = await Crop.findOne({
      isActive: true,
      $or: [
        { name: normalizedCropName },
        { name: { $regex: new RegExp(`^${escapeRegExp(normalizedCropName)}$`, 'i') } },
      ],
    });

    if (!crop) {
      return res.status(404).json({ message: 'Crop not found. Please seed the crop catalog or choose a valid crop.' });
    }

    const generatedPlan = buildCultivationPlan(crop, {
      plantingDate,
      soilType,
      irrigationMethod: irrigationMethod || 'Drip',
      farmingPractice: farmingPractice || 'conventional',
    });

    const plan = await CultivationPlan.create({
      userId: req.user._id,
      cropId: crop._id,
      plantingDate,
      soilType,
      irrigationMethod: irrigationMethod || 'Drip',
      farmingPractice: farmingPractice || 'conventional',
      expectedHarvestDate: generatedPlan.expectedHarvestDate,
      generatedPlan: {
        suitabilitySummary: generatedPlan.suitabilitySummary,
        landPreparation: generatedPlan.landPreparation,
        fertilizerSchedule: generatedPlan.fertilizerSchedule,
        irrigationSchedule: generatedPlan.irrigationSchedule,
        maintenanceSchedule: generatedPlan.maintenanceSchedule,
      },
      tasks: generatedPlan.tasks,
      status: 'active',
    });

    res.status(201).json({ plan: getPlanResponse(plan, crop) });
  } catch (error) {
    next(error);
  }
};

const getMyPlans = async (req, res, next) => {
  try {
    const storedPlans = await CultivationPlan.find({ userId: req.user._id }).sort({ createdAt: -1 });
    const plans = await Promise.all(storedPlans.map(async (storedPlan) => {
      if (storedPlan.tasks?.length) return storedPlan.toObject();
      storedPlan.tasks = buildDailyTasks(storedPlan.plantingDate, storedPlan.generatedPlan);
      await storedPlan.save();
      return storedPlan.toObject();
    }));
    const cropMap = {};
    const crops = await Crop.find({});
    crops.forEach((crop) => {
      cropMap[crop._id.toString()] = crop.name;
    });

    const formatted = plans.map((plan) => ({
      ...plan,
      cropName: cropMap[plan.cropId.toString()] || 'Crop',
    }));

    res.json({ plans: formatted });
  } catch (error) {
    next(error);
  }
};

const getPlanById = async (req, res, next) => {
  try {
    let plan = await CultivationPlan.findOne({ _id: req.params.id, userId: req.user._id });
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    if (!plan.tasks?.length) {
      plan.tasks = buildDailyTasks(plan.plantingDate, plan.generatedPlan);
      await plan.save();
    }
    plan = plan.toObject();

    const crop = await Crop.findById(plan.cropId).lean();
    if (!crop) return res.status(404).json({ message: 'Crop for this plan was not found' });

    res.json({ plan: getPlanResponse(plan, crop) });
  } catch (error) {
    next(error);
  }
};

const updatePlan = async (req, res, next) => {
  try {
    const { cropName, plantingDate, soilType, irrigationMethod, farmingPractice } = req.body;
    if (!cropName || !plantingDate || !soilType) {
      return res.status(400).json({ message: 'Crop name, planting date and soil type are required' });
    }

    const crop = await Crop.findOne({
      isActive: true,
      name: { $regex: new RegExp(`^${escapeRegExp(String(cropName).trim())}$`, 'i') },
    });
    if (!crop) return res.status(404).json({ message: 'Crop not found' });

    const generatedPlan = buildCultivationPlan(crop, {
      plantingDate,
      soilType,
      irrigationMethod: irrigationMethod || 'Drip',
      farmingPractice: farmingPractice || 'conventional',
    });
    const plan = await CultivationPlan.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      {
        cropId: crop._id,
        plantingDate,
        soilType,
        irrigationMethod: irrigationMethod || 'Drip',
        farmingPractice: farmingPractice || 'conventional',
        expectedHarvestDate: generatedPlan.expectedHarvestDate,
        generatedPlan,
        tasks: generatedPlan.tasks,
      },
      { new: true, runValidators: true }
    );
    if (!plan) return res.status(404).json({ message: 'Plan not found' });

    res.json({ plan: getPlanResponse(plan, crop) });
  } catch (error) {
    next(error);
  }
};

const deletePlan = async (req, res, next) => {
  try {
    const plan = await CultivationPlan.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.json({ message: 'Plan deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const toggleTask = async (req, res, next) => {
  try {
    const plan = await CultivationPlan.findOne({ _id: req.params.id, userId: req.user._id });
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    const task = plan.tasks.id(req.params.taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date() : undefined;
    await plan.save();
    res.json({ task });
  } catch (error) {
    next(error);
  }
};

export { generatePlan, getMyPlans, getPlanById, updatePlan, deletePlan, toggleTask };
