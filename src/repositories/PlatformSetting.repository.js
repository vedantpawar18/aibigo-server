const BaseRepository = require('./BaseRepository');
const PlatformSetting = require('../models/PlatformSetting.model');

class PlatformSettingRepository extends BaseRepository {
  constructor() {
    super(PlatformSetting);
  }
}

module.exports = new PlatformSettingRepository();
