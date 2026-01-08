const BaseRepository = require('./BaseRepository');
const IndustryPartner = require('../models/IndustryPartner.model');

class IndustryPartnerRepository extends BaseRepository {
  constructor() {
    super(IndustryPartner);
  }
}

module.exports = new IndustryPartnerRepository();
