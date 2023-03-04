const { AuthenticationError } = require('apollo-server-express');
const  Admin  = require('../models');
const { verifyToken } = require('../utils/auth');

const makeContext = async (req) => {
    console.log(req);
  const token = req?.headers?.authorization;
  let currentUser = null;
  if (token) {
    currentUser  = verifyToken(token);
    // console.log(id);
    // currentUser = await Admin.findById(id);
    if (!currentUser) {
      throw new AuthenticationError('Invalid or expired token');
    }
  }
  return { currentUser };
};

module.exports = makeContext;
