import mongoose from 'mongoose';

const plantHealthReportSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    imageUrl: { type: String, required: true },
    diagnosis: {
      condition: { type: String, required: true },
      symptoms: [{ type: String }],
      possibleCauses: [{ type: String }],
    },
    confidenceScore: { type: Number, default: 0 },
    remedySuggested: {
      chemical: String,
      organic: String,
    },
    reviewedByAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    adminNotes: { type: String, default: '' },
    correctedCondition: { type: String, default: '' },
    reviewStatus: { type: String, enum: ['pending', 'reviewed'], default: 'pending' },
  },
  { timestamps: true }
);

export default mongoose.model('PlantHealthReport', plantHealthReportSchema);
