const mongoose = require('mongoose');

const allActivities = mongoose.Schema({
  wch: {type: String, trim: true},
  id1: {type: String, trim: true},
  id2: {type: String, trim: true},
  id3: {type: String, trim: true}
}, { timestamps: true });

module.exports = mongoose.model('all_activities', allActivities);