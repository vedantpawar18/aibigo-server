const BaseRepository = require('./BaseRepository');
const Subject = require('../models/Subject.model');

class SubjectRepository extends BaseRepository {
  constructor() {
    super(Subject);
  }
}

module.exports = new SubjectRepository();
