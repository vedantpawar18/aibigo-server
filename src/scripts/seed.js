require('dotenv').config();
const { connectDB, disconnectDB } = require('../config/database');
const UserRepository = require('../repositories/User.repository');
const bcrypt = require('bcrypt');

/**
 * Seed script to create initial PLATFORM_ADMIN user
 */
const seedPlatformAdmin = async () => {
  try {
    await connectDB();

    const email = 'platformadmin@email.com';
    const password = 'platformAdmin123';

    // Check if user already exists
    const existingUser = await UserRepository.findOne({ email });
    if (existingUser) {
      console.log('PLATFORM_ADMIN user already exists:', email);
      return existingUser;
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create PLATFORM_ADMIN user
    const user = await UserRepository.create({
      email,
      passwordHash,
      role: 'PLATFORM_ADMIN',
      status: 'ACTIVE',
      linkedEntity: {
        type: 'NONE'
      }
    });

    console.log('✅ PLATFORM_ADMIN user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Role: PLATFORM_ADMIN');
    console.log('User ID:', user._id);

    return user;
  } catch (error) {
    console.error('Error seeding PLATFORM_ADMIN:', error);
    throw error;
  } finally {
    await disconnectDB();
  }
};

// Run seed if called directly
if (require.main === module) {
  seedPlatformAdmin()
    .then(() => {
      console.log('Seed completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seed failed:', error);
      process.exit(1);
    });
}

module.exports = { seedPlatformAdmin };
