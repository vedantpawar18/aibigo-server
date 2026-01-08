const BaseRepository = require('./BaseRepository');
const Assessment = require('../models/Assessment.model');

class AssessmentRepository extends BaseRepository {
  constructor() {
    super(Assessment);
  }
}

module.exports = new AssessmentRepository();
