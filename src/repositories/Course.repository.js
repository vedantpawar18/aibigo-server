const BaseRepository = require('./BaseRepository');
const Course = require('../models/Course.model');

class CourseRepository extends BaseRepository {
  constructor() {
    super(Course);
  }
}

module.exports = new CourseRepository();
