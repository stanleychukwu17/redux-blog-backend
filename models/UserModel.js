const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  username: {type: String, required: true, trim: true, index: {unique: true}, minlength: 3},
  password: {type: String, required: true, trim: true, minlength: 3},
  avatar: {type: String},
}, { timestamps: true });

// UserSchema.methods.comparePassword = async function comparePassword(candidate) {
//   return bcrypt.compare(candidate, this.password);
// };

module.exports = mongoose.model('User', UserSchema);