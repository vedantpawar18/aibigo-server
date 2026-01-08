const UserRepository = require('../repositories/User.repository');
const bcrypt = require('bcrypt');

/**
 * Create admin user
 */
const createAdminUser = async (name, email, role) => {
  // Validate role
  if (!['OPERATIONS_ADMIN', 'FACULTY'].includes(role)) {
    const error = new Error('Invalid role. Must be OPERATIONS_ADMIN or FACULTY');
    error.statusCode = 400;
    throw error;
  }

  // Check if user already exists
  const existingUser = await UserRepository.findOne({ email });
  if (existingUser) {
    const error = new Error('Email already registered');
    error.statusCode = 409;
    throw error;
  }

  // Generate random password (in production, send via email)
  const randomPassword = Math.random().toString(36).slice(-12);
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(randomPassword, saltRounds);

  // Create admin user
  const user = await UserRepository.create({
    email,
    passwordHash,
    role,
    status: 'ACTIVE',
    linkedEntity: {
      type: 'NONE'
    }
  });

  // TODO: Send password via email
  console.log(`Admin user created: ${email}, Temporary password: ${randomPassword}`);

  return {
    id: user._id,
    email: user.email,
    role: user.role,
    status: user.status
    // In production, don't return password
  };
};

module.exports = {
  createAdminUser
};
