const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const adminSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4(),
    unique: true,
  },  
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: 'admin',
  },
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
