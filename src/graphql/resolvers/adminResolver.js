const { AuthenticationError } = require("apollo-server-express");
const { createToken } = require("../../utils/auth");
const Admin = require("../../models/admin");
const bcrypt = require("bcrypt");

const adminResolver = {
  Query: {
    async adminProfile(_, __, { currentUser }) {
      if (!currentUser) {
        throw new AuthenticationError("Unauthorized");
      }

      const admin = await Admin.findById(currentUser.id);
      if (!admin) {
        throw new NotFoundError("Admin not found");
      }

      return admin;
    },
  },

  Mutation: {
    async createAdmin(_, { input }) {
      try {
        const { name, email, password } = input;

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
          throw new AuthenticationError("Admin already exists");
        }
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create admin instance
        const newAdmin = new Admin({
          name,
          email,
          password: hashedPassword,
          role: "admin",
        });
        // Save admin to database
        await newAdmin.save();
        // Return admin
        const token = createToken(newAdmin);
        return {
          token,
          admin: newAdmin,
        };
      } catch (error) {
        throw new Error(error);
      }
    },

    async adminLogin(_, { email, password }) {


      const admin = await Admin.findOne({ email });
    
      if (!admin) {
        throw new AuthenticationError('Invalid email or password');
      }
    
      const validPassword = await bcrypt.compare(password, admin.password);
    
      if (!validPassword) {
        throw new AuthenticationError('Invalid email or password');
      }
    
      const token = createToken(admin);
      return new Promise((resolve, reject) => {
        resolve({
          token,
          admin,
        });
      });
    },
  },
};

module.exports = adminResolver;
