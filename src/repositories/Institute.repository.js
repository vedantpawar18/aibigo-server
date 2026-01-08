const BaseRepository = require('./BaseRepository');
const Institute = require('../models/Institute.model');

class InstituteRepository extends BaseRepository {
  constructor() {
    super(Institute);
  }
}

module.exports = new InstituteRepository();
