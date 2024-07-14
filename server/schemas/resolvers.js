const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper function to create a JWT token
const createToken = (user, expiresIn) => { 
  const { id, email, username } = user;
  const secret = process.env.JWT_SECRET || 'fallbackSecret'; // Use the same fallback method
  return jwt.sign({ id, email, username }, secret, { expiresIn });
};

const resolvers = {
  Query: {
    // Fetches all users
    users: async () => await User.find({}),
    // Fetches a single user by ID
    user: async (_, { id }) => {
      const user = await User.findById(id);
      if (!user) throw new Error('User not found');
      return user;
    },
  },
  Mutation: {
    // Handles user login
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error('User not found');
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) throw new Error('Invalid password');
      return {
        userId: user.id,
        token: createToken(user, '2h'),
        tokenExpiration: 2
      };
    },
    // Adds a new user
    addUser: async (_, { username, email, password }) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) throw new Error('User already exists');
      const newUser = new User({
        username,
        email,
        password
      });
      const result = await newUser.save();
      return result;
    },
    // Updates an existing user
    updateUser: async (_, { id, username, email }) => {
      const updates = {};
      if (username !== undefined) updates.username = username;
      if (email !== undefined) updates.email = email;
      const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });
      if (!updatedUser) throw new Error('User not found');
      return updatedUser;
    },
    // Deletes an existing user
    deleteUser: async (_, { id }) => {
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) throw new Error('User not found');
      return deletedUser;
    },
  },
  // User: {
  //   // Resolves the products created by a user
  //   products: async (user) => {
  //     return await Product.find({ artisan: user.id });
  //   },
  // },
  // Product: {
  //   // Resolves the user who created a product
  //   artisan: async (product) => {
  //     return await User.findById(product.artisan);
  //   },
  // },
};

module.exports = resolvers;
