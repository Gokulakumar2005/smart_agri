const Crop = require('../models/Crop');

const getCrops = async (req, res, next) => {
  try {
    const crops = await Crop.find({ isActive: true }).sort({ name: 1 });
    res.json({ crops });
  } catch (error) {
    next(error);
  }
};

const getCropById = async (req, res, next) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }
    res.json({ crop });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCrops, getCropById };
