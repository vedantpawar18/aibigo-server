/**
 * Base Repository Pattern
 * Provides abstraction layer for database operations
 * Can be replaced with PostgreSQL, DynamoDB, CosmosDB implementations
 */
class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  /**
   * Create a new document
   * @param {Object} data - Document data
   * @returns {Promise<Object>} Created document
   */
  async create(data) {
    try {
      const document = new this.model(data);
      return await document.save();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Find document by ID
   * @param {string} id - Document ID
   * @param {Object} options - Query options (select, populate, etc.)
   * @returns {Promise<Object|null>} Found document or null
   */
  async findById(id, options = {}) {
    try {
      let query = this.model.findById(id);
      
      if (options.select) {
        query = query.select(options.select);
      }
      
      if (options.populate) {
        // Mongoose populate accepts arrays directly
        query = query.populate(options.populate);
      }

      return await query.exec();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Find one document by query
   * @param {Object} query - Query object
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} Found document or null
   */
  async findOne(query, options = {}) {
    try {
      let dbQuery = this.model.findOne(query);
      
      if (options.select) {
        dbQuery = dbQuery.select(options.select);
      }
      
      if (options.populate) {
        // Mongoose populate accepts arrays directly
        dbQuery = dbQuery.populate(options.populate);
      }

      return await dbQuery.exec();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Find multiple documents
   * @param {Object} query - Query object
   * @param {Object} options - Query options (limit, skip, sort, select, populate)
   * @returns {Promise<Array>} Array of documents
   */
  async find(query = {}, options = {}) {
    try {
      let dbQuery = this.model.find(query);
      
      if (options.select) {
        dbQuery = dbQuery.select(options.select);
      }
      
      if (options.sort) {
        dbQuery = dbQuery.sort(options.sort);
      }
      
      if (options.skip) {
        dbQuery = dbQuery.skip(options.skip);
      }
      
      if (options.limit) {
        dbQuery = dbQuery.limit(options.limit);
      }
      
      if (options.populate) {
        // Mongoose populate accepts arrays directly
        dbQuery = dbQuery.populate(options.populate);
      }

      return await dbQuery.exec();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update document by ID
   * @param {string} id - Document ID
   * @param {Object} data - Update data
   * @param {Object} options - Update options (new, runValidators, etc.)
   * @returns {Promise<Object|null>} Updated document or null
   */
  async updateById(id, data, options = {}) {
    try {
      const updateOptions = {
        new: options.new !== undefined ? options.new : true,
        runValidators: options.runValidators !== undefined ? options.runValidators : true,
        ...options,
      };

      return await this.model.findByIdAndUpdate(id, data, updateOptions);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update one document by query
   * @param {Object} query - Query object
   * @param {Object} data - Update data
   * @param {Object} options - Update options
   * @returns {Promise<Object|null>} Updated document or null
   */
  async updateOne(query, data, options = {}) {
    try {
      const updateOptions = {
        new: options.new !== undefined ? options.new : true,
        runValidators: options.runValidators !== undefined ? options.runValidators : true,
        ...options,
      };

      return await this.model.findOneAndUpdate(query, data, updateOptions);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete document by ID
   * @param {string} id - Document ID
   * @returns {Promise<Object|null>} Deleted document or null
   */
  async deleteById(id) {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete one document by query
   * @param {Object} query - Query object
   * @returns {Promise<Object|null>} Deleted document or null
   */
  async deleteOne(query) {
    try {
      return await this.model.findOneAndDelete(query);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Count documents
   * @param {Object} query - Query object
   * @returns {Promise<number>} Count of documents
   */
  async count(query = {}) {
    try {
      return await this.model.countDocuments(query);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Check if document exists
   * @param {Object} query - Query object
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  async exists(query) {
    try {
      const count = await this.model.countDocuments(query);
      return count > 0;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Aggregate documents
   * @param {Array} pipeline - Aggregation pipeline
   * @returns {Promise<Array>} Aggregated results
   */
  async aggregate(pipeline) {
    try {
      return await this.model.aggregate(pipeline);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle database errors
   * @param {Error} error - Error object
   * @returns {Error} Formatted error
   */
  handleError(error) {
    // Abstract error handling - can be customized per database implementation
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      const formattedError = new Error(messages.join(', '));
      formattedError.statusCode = 400;
      formattedError.name = 'ValidationError';
      return formattedError;
    }

    if (error.name === 'CastError') {
      const formattedError = new Error(`Invalid ${error.path}: ${error.value}`);
      formattedError.statusCode = 400;
      formattedError.name = 'CastError';
      return formattedError;
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const formattedError = new Error(`${field} already exists`);
      formattedError.statusCode = 409;
      formattedError.name = 'DuplicateError';
      return formattedError;
    }

    return error;
  }
}

module.exports = BaseRepository;
