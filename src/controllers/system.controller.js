const systemService = require('../services/system.service');

/**
 * Create admin user
 */
const createAdminUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const result = await systemService.createAdminUser(name, email, role);
    
    res.status(201).json({
      message: 'Admin user created successfully',
      data: result
    });
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({
      error: error.message,
      message: error.message,
      statusCode
    });
  }
};

module.exports = {
  createAdminUser
};
