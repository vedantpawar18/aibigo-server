const BaseRepository = require('./BaseRepository');
const Opportunity = require('../models/Opportunity.model');

class OpportunityRepository extends BaseRepository {
  constructor() {
    super(Opportunity);
  }
}

module.exports = new OpportunityRepository();
