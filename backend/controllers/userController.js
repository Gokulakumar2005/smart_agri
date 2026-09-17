import User from '../models/User.js';

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).lean();
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

const updateMe = async (req, res, next) => {
  try {
    const allowedFields = ['name', 'farmLocation', 'farmingPractice'];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

export { getMe, updateMe };
