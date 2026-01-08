const BaseRepository = require('./BaseRepository');
const Payment = require('../models/Payment.model');

class PaymentRepository extends BaseRepository {
  constructor() {
    super(Payment);
  }
}

module.exports = new PaymentRepository();
