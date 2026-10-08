const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');

/**
 * Generate a signed JSON Web Token
 * @param {string} userId - UUID of the user
 * @returns {string} Signed JWT
 */
const generateToken = (userId) => {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  });
};

/**
 * Register a new user account
 * @param {Object} userData - { fullName, email, password }
 */
const register = async ({ fullName, email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  // Check for email collision
  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail }
  });

  if (existingUser) {
    throw ApiError.conflict('An account with this email address already exists', [
      { field: 'email', message: 'Email address is already in use' }
    ]);
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // Create user
  const user = await prisma.user.create({
    data: {
      fullName: fullName.trim(),
      email: normalizedEmail,
      passwordHash
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      createdAt: true,
      updatedAt: true
    }
  });

  const token = generateToken(user.id);

  return { user, token };
};

/**
 * Authenticate existing user with email and password
 * @param {Object} credentials - { email, password }
 */
const login = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail }
  });

  // Generic message for both wrong email and wrong password to prevent user enumeration
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const token = generateToken(user.id);

  const sanitizedUser = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };

  return { user: sanitizedUser, token };
};

/**
 * Fetch current authenticated user profile
 * @param {string} userId - UUID of the user
 */
const getCurrentUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      fullName: true,
      email: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!user) {
    throw ApiError.notFound('User account no longer exists');
  }

  return user;
};

module.exports = {
  register,
  login,
  getCurrentUser
};
