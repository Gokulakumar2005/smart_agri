const mongoose = require('mongoose');

const fertilizerScheduleSchema = new mongoose.Schema(
  {
    stage: String,
    daysFromPlanting: Number,
    nutrient: String,
    conventionalInput: String,
    organicAlternative: String,
    notes: String,
  },
  { _id: false }
);

const irrigationScheduleSchema = new mongoose.Schema(
  {
    stage: String,
    daysFromPlanting: Number,
    frequency: String,
    notes: String,
  },
  { _id: false }
);

const maintenanceScheduleSchema = new mongoose.Schema(
  {
    stage: String,
    daysFromPlanting: Number,
    task: String,
  },
  { _id: false }
);

const growthStageSchema = new mongoose.Schema(
  {
    name: String,
    startDay: Number,
    endDay: Number,
    description: String,
  },
  { _id: false }
);

const cropSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    suitableSoilTypes: [{ type: String }],
    growthDurationDays: { type: Number, required: true },
    landPreparation: [{ type: String }],
    growthStages: [growthStageSchema],
    fertilizerSchedule: [fertilizerScheduleSchema],
    irrigationSchedule: [irrigationScheduleSchema],
    maintenanceSchedule: [maintenanceScheduleSchema],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Crop', cropSchema);
