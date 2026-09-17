const Crop = require('../models/Crop');
const CultivationPlan = require('../models/CultivationPlan');
const { buildCultivationPlan } = require('../services/planGenerator');

const generatePlan = async (req, res, next) => {
  try {
    const { cropName, plantingDate, soilType, irrigationMethod, farmingPractice } = req.body;

    if (!cropName || !plantingDate || !soilType) {
      return res.status(400).json({ message: 'Crop name, planting date and soil type are required' });
    }

    const crop = await Crop.findOne({ name: cropName, isActive: true });
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
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
      status: 'active',
    });

    const response = {
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
    };

    res.status(201).json({ plan: response });
  } catch (error) {
    next(error);
  }
};

const getMyPlans = async (req, res, next) => {
  try {
    const plans = await CultivationPlan.find({ userId: req.user._id }).sort({ createdAt: -1 }).lean();
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
    const plan = await CultivationPlan.findOne({ _id: req.params.id, userId: req.user._id });
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    res.json({ plan });
  } catch (error) {
    next(error);
  }
};

module.exports = { generatePlan, getMyPlans, getPlanById };
