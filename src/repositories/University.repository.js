const BaseRepository = require('./BaseRepository');
const University = require('../models/University.model');

class UniversityRepository extends BaseRepository {
  constructor() {
    super(University);
  }
}

module.exports = new UniversityRepository();
