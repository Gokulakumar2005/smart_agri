const mongoose = require('mongoose');

const cultivationPlanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cropId: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop', required: true },
    plantingDate: { type: Date, required: true },
    soilType: { type: String, required: true },
    irrigationMethod: { type: String, required: true },
    farmingPractice: { type: String, required: true },
    expectedHarvestDate: { type: Date, required: true },
    generatedPlan: {
      suitabilitySummary: String,
      landPreparation: [String],
      fertilizerSchedule: [Object],
      irrigationSchedule: [Object],
      maintenanceSchedule: [Object],
    },
    status: { type: String, enum: ['active', 'completed', 'archived'], default: 'active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CultivationPlan', cultivationPlanSchema);
