const mongoose = require('mongoose');

const UdtsSchema = mongoose.Schema({
  uid : {type: String, required: true},
  shash: {type: String, required: true},
});

module.exports = mongoose.model('udts', UdtsSchema);