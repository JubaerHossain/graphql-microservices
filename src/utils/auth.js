const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server-express");
const config = require("config");
const { UnauthorizedError } = require("./errors");

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  if (!authHeader) {
    throw new UnauthorizedError("No authorization header provided");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new UnauthorizedError("No token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    throw new UnauthorizedError("Invalid token");
  }
};

const verifyToken = (token) => {
  try {
    const _token = token;
    if (!_token) {
      throw new UnauthorizedError("No token provided");
    }
    const decoded = jwt.verify(_token, config.get("JWT_SECRET"));
    return decoded;
  } catch (err) {
    throw new AuthenticationError("Invalid token");
  }
};

const createToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, config.get("JWT_SECRET"), {
    expiresIn: config.get("JWT_SECRET_EXPIRATION"),
  });
};

module.exports = { auth, createToken, verifyToken };
