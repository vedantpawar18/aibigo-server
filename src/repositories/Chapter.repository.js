const BaseRepository = require('./BaseRepository');
const Chapter = require('../models/Chapter.model');

class ChapterRepository extends BaseRepository {
  constructor() {
    super(Chapter);
  }
}

module.exports = new ChapterRepository();
