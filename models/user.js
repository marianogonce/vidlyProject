const mongoose = require("mongoose");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    require: true,
    unique: true,
    minlength: 5,
    maxlength: 255,
  },
  password: {
    type: String,
    require: true,
    minlength: 5,
    maxlength: 1024,
  },
  isAdmin: { type: Boolean, require: false, default: false },
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey"),
    { expiresIn: "2h" }
  );
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const complexityOptions = {
    min: 5,
    max: 255,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 6,
  };
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: passwordComplexity(complexityOptions),
    isAdmin: Joi.boolean(),
  });

  return schema.validate(user);
}

module.exports.User = User;
module.exports.validate = validateUser;
