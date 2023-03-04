const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const { BadRequestError } = require('../utils/errors');

const registerAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      throw new BadRequestError('Admin already exists');
    }

    const admin = new Admin({ name, email, password });
    await admin.save();

    const token = jwt.sign({ email: admin.email, role: admin.role }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.status(201).json({ success: true, token });
  } catch (err) {
    next(err);
  }
};

const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      throw new BadRequestError('Invalid credentials');
    }

    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    const token = jwt.sign({ email: admin.email, role: admin.role }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.status(200).json({ success: true, token });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
};
