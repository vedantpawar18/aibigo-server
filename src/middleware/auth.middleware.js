const { verifyToken } = require('../utils/jwt.util');
const UserRepository = require('../repositories/User.repository');

/**
 * Authenticate JWT token
 * Verifies token and attaches user to req.user
 */
const authenticateJWT = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'No token provided. Please provide a valid JWT token in Authorization header.',
        statusCode: 401
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Token is invalid or expired',
        statusCode: 401
      });
    }

    // Get user from database
    const user = await UserRepository.findById(decoded.sub);
    if (!user) {
      return res.status(401).json({
        error: 'User not found',
        message: 'User associated with token does not exist',
        statusCode: 401
      });
    }

    // Check if user is active
    if (user.status === 'SUSPENDED' || user.status === 'LOCKED') {
      return res.status(403).json({
        error: 'Account suspended or locked',
        message: 'Your account has been suspended or locked',
        statusCode: 403
      });
    }

    // Attach user and token info to request
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      status: user.status,
      permissions: decoded.permissions || []
    };

    next();
  } catch (error) {
    return res.status(500).json({
      error: 'Authentication error',
      message: error.message,
      statusCode: 500
    });
  }
};

/**
 * Authorize by roles
 * @param {...string} roles - Allowed roles
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please authenticate first',
        statusCode: 401
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `Access denied. Required roles: ${roles.join(', ')}`,
        statusCode: 403
      });
    }

    next();
  };
};

/**
 * Authorize by permissions
 * @param {...string} permissions - Required permissions
 */
const authorizePermissions = (...permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please authenticate first',
        statusCode: 401
      });
    }

    // PLATFORM_ADMIN has all permissions
    if (req.user.role === 'PLATFORM_ADMIN') {
      return next();
    }

    const userPermissions = req.user.permissions || [];
    
    // Check if user has all required permissions
    const hasAllPermissions = permissions.every(perm => 
      userPermissions.includes(perm) || userPermissions.includes('*')
    );

    if (!hasAllPermissions) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `Access denied. Required permissions: ${permissions.join(', ')}`,
        statusCode: 403
      });
    }

    next();
  };
};

module.exports = {
  authenticateJWT,
  authorizeRoles,
  authorizePermissions
};
