import Crop from '../models/Crop.js';
import User from '../models/User.js';
import CultivationPlan from '../models/CultivationPlan.js';
import PlantHealthReport from '../models/PlantHealthReport.js';

const getCrops = async (req, res, next) => {
  try {
    const crops = await Crop.find({}).sort({ name: 1 });
    res.json({ crops });
  } catch (error) {
    next(error);
  }
};

const createCrop = async (req, res, next) => {
  try {
    const crop = await Crop.create(req.body);
    res.status(201).json({ crop });
  } catch (error) {
    next(error);
  }
};

const updateCrop = async (req, res, next) => {
  try {
    const crop = await Crop.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }
    res.json({ crop });
  } catch (error) {
    next(error);
  }
};

const deleteCrop = async (req, res, next) => {
  try {
    const result = await Crop.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Crop not found' });
    }
    res.json({ message: 'Crop deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 }).select('-password');
    res.json({ users });
  } catch (error) {
    next(error);
  }
};

const toggleBlockUser = async (req, res, next) => {
  try {
    const { isBlocked } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { isBlocked }, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user, message: isBlocked ? 'User blocked' : 'User unblocked' });
  } catch (error) {
    next(error);
  }
};

const getReports = async (req, res, next) => {
  try {
    const { lowConfidence, reviewed } = req.query;
    const query = {};

    if (lowConfidence === 'true') {
      query.confidenceScore = { $lt: 0.75 };
    }

    if (reviewed === 'false') {
      query.reviewStatus = 'pending';
    }

    const reports = await PlantHealthReport.find(query).sort({ createdAt: -1 });
    res.json({ reports });
  } catch (error) {
    next(error);
  }
};

const reviewReport = async (req, res, next) => {
  try {
    const { adminNotes, correctedCondition } = req.body;
    const report = await PlantHealthReport.findByIdAndUpdate(
      req.params.id,
      {
        adminNotes: adminNotes || '',
        correctedCondition: correctedCondition || '',
        reviewedByAdmin: req.user._id,
        reviewStatus: 'reviewed',
      },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json({ report, message: 'Report reviewed successfully' });
  } catch (error) {
    next(error);
  }
};

const getAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalPlans = await CultivationPlan.countDocuments();
    const mostGrownCrops = await CultivationPlan.aggregate([
      { $group: { _id: '$cropId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 },
      { $lookup: { from: 'crops', localField: '_id', foreignField: '_id', as: 'crop' } },
      { $unwind: '$crop' },
      { $project: { crop: '$crop.name', count: 1, _id: 0 } },
    ]);

    const commonPlantHealthIssues = await PlantHealthReport.aggregate([
      { $group: { _id: '$diagnosis.condition', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 },
      { $project: { issue: '$_id', count: 1, _id: 0 } },
    ]);

    res.json({ totalUsers, totalPlans, mostGrownCrops, commonPlantHealthIssues });
  } catch (error) {
    next(error);
  }
};

export {
  getCrops,
  createCrop,
  updateCrop,
  deleteCrop,
  getUsers,
  toggleBlockUser,
  getReports,
  reviewReport,
  getAnalytics,
};
