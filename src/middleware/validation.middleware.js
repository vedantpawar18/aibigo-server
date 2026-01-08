/**
 * Request validation middleware
 */

/**
 * Validate email format
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
const isValidPassword = (password) => {
  if (!password || password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  // Optional: Add more password strength checks
  // if (!/[A-Z]/.test(password)) {
  //   return { valid: false, message: 'Password must contain at least one uppercase letter' };
  // }
  // if (!/[0-9]/.test(password)) {
  //   return { valid: false, message: 'Password must contain at least one number' };
  // }
  return { valid: true };
};

/**
 * Validate register request
 */
const validateRegister = (req, res, next) => {
  const { email, password } = req.body;

  // Check required fields
  if (!email || !password) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'Email and password are required',
      statusCode: 400
    });
  }

  // Validate email
  if (!isValidEmail(email)) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'Invalid email format',
      statusCode: 400
    });
  }

  // Validate password
  const passwordValidation = isValidPassword(password);
  if (!passwordValidation.valid) {
    return res.status(400).json({
      error: 'Validation error',
      message: passwordValidation.message,
      statusCode: 400
    });
  }

  next();
};

/**
 * Validate login request
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'Email and password are required',
      statusCode: 400
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'Invalid email format',
      statusCode: 400
    });
  }

  next();
};

/**
 * Validate forgot password request
 */
const validateForgotPassword = (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'Email is required',
      statusCode: 400
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'Invalid email format',
      statusCode: 400
    });
  }

  next();
};

/**
 * Validate reset password request
 */
const validateResetPassword = (req, res, next) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'Token and newPassword are required',
      statusCode: 400
    });
  }

  const passwordValidation = isValidPassword(newPassword);
  if (!passwordValidation.valid) {
    return res.status(400).json({
      error: 'Validation error',
      message: passwordValidation.message,
      statusCode: 400
    });
  }

  next();
};

/**
 * Validate admin user creation request
 */
const validateCreateAdminUser = (req, res, next) => {
  const { name, email, role } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'Name, email, and role are required',
      statusCode: 400
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'Invalid email format',
      statusCode: 400
    });
  }

  const allowedRoles = ['OPERATIONS_ADMIN', 'FACULTY'];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({
      error: 'Validation error',
      message: `Role must be one of: ${allowedRoles.join(', ')}`,
      statusCode: 400
    });
  }

  next();
};

/**
 * Validate ObjectId format
 */
const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Validate ObjectId parameter
 */
const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName] || req.body[paramName] || req.query[paramName];
    
    if (id && !isValidObjectId(id)) {
      return res.status(400).json({
        error: 'Validation error',
        message: `Invalid ${paramName} format`,
        statusCode: 400
      });
    }

    next();
  };
};

module.exports = {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateCreateAdminUser,
  validateObjectId,
  isValidEmail,
  isValidPassword
};
