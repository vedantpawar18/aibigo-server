const BaseRepository = require('./BaseRepository');
const Program = require('../models/Program.model');

class ProgramRepository extends BaseRepository {
  constructor() {
    super(Program);
  }
}

module.exports = new ProgramRepository();
