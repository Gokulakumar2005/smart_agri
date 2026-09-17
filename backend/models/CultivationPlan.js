import mongoose from 'mongoose';

const cultivationPlanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cropId: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop', required: true },
    plantingDate: { type: Date, required: true },
      soilType: { type: String, required: true, default: 'unknown' },
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
    tasks: [{
      title: String,
      category: { type: String, enum: ['land', 'fertilizer', 'irrigation', 'maintenance'] },
      dueDate: Date,
      details: String,
      completed: { type: Boolean, default: false },
      completedAt: Date,
    }],
    status: { type: String, enum: ['active', 'completed', 'archived'], default: 'active' },
  },
  { timestamps: true }
);

export default mongoose.model('CultivationPlan', cultivationPlanSchema);
