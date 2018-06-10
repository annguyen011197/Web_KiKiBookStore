var mongoose = require("mongoose");
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var AccountSchema = mongoose.Schema({
  local: {
    username: {
      type: String,
      validate: {
        validator: v => {
          return v != "";
        },
        message: "first name not empty"
      },
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    accountType: {
      type: Boolean,
      default: false
    },
    accountInfo: {
      type: Schema.Types.ObjectId,
      ref: "AccountInfo"
    }
  },
  facebook: {
    id: String,
    token: String,
    name: String,
    email: String
  },
  twitter: {
    id: String,
    token: String,
    displayName: String,
    username: String
  },
  google: {
    id: String,
    token: String,
    email: String,
    name: String
  }
});

AccountSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

AccountSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model("Account", AccountSchema);
