const BaseRepository = require('./BaseRepository');
const SubscriptionPlan = require('../models/SubscriptionPlan.model');

class SubscriptionPlanRepository extends BaseRepository {
  constructor() {
    super(SubscriptionPlan);
  }
}

module.exports = new SubscriptionPlanRepository();
