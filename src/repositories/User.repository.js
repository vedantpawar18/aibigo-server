const BaseRepository = require('./BaseRepository');
const User = require('../models/User.model');

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }
}

module.exports = new UserRepository();
