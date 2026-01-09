const BaseRepository = require('./BaseRepository');
const AuditLog = require('../models/AuditLog.model');

class AuditLogRepository extends BaseRepository {
  constructor() {
    super(AuditLog);
  }

  /**
   * Get audit logs with pagination and filters
   * @param {Object} filters - Filter options
   * @param {Object} pagination - Pagination options
   * @returns {Promise<Object>} Logs and pagination info
   */
  async findWithPagination(filters = {}, pagination = {}) {
    try {
      const page = parseInt(pagination.page) || 1;
      const limit = parseInt(pagination.limit) || 50;
      const skip = (page - 1) * limit;

      const query = {};
      
      if (filters.userId) {
        query.userId = filters.userId;
      }
      
      if (filters.action) {
        query.action = filters.action;
      }
      
      if (filters.startDate || filters.endDate) {
        query.timestamp = {};
        if (filters.startDate) {
          query.timestamp.$gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
          query.timestamp.$lte = new Date(filters.endDate);
        }
      }

      const [logs, total] = await Promise.all([
        this.model
          .find(query)
          .populate('userId', 'email role')
          .sort({ timestamp: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        this.model.countDocuments(query)
      ]);

      return {
        logs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

module.exports = new AuditLogRepository();
