import PlantHealthReport from '../models/PlantHealthReport.js';
import { analyzePlantHealth } from '../services/plantHealthService.js';

const uploadPlantHealthImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const analysis = await analyzePlantHealth(imageUrl);

    const report = await PlantHealthReport.create({
      userId: req.user._id,
      imageUrl,
      diagnosis: analysis.diagnosis,
      confidenceScore: analysis.confidenceScore,
      remedySuggested: analysis.remedySuggested,
    });

    res.status(201).json({
      message: 'Plant health report created',
      report: {
        _id: report._id,
        imageUrl: report.imageUrl,
        diagnosis: report.diagnosis,
        confidenceScore: report.confidenceScore,
        remedySuggested: report.remedySuggested,
      },
    });
  } catch (error) {
    next(error);
  }
};

const listReports = async (req, res, next) => {
  try {
    const reports = await PlantHealthReport.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ reports });
  } catch (error) {
    next(error);
  }
};

export { uploadPlantHealthImage, listReports };
