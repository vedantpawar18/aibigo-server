const BaseRepository = require('./BaseRepository');
const AnalyticsTrigger = require('../models/AnalyticsTrigger.model');

class AnalyticsTriggerRepository extends BaseRepository {
  constructor() {
    super(AnalyticsTrigger);
  }
}

module.exports = new AnalyticsTriggerRepository();
