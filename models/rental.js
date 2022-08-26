const mongoose = require("mongoose");
const Joi = require("joi");

const Rental = mongoose.model(
  "Rental",
  new mongoose.Schema({
    customer: {
      type: new mongoose.Schema({
        name: {
          type: String,
          require: true,
          minlength: 5,
          maxlength: 50,
        },
        phone: {
          type: String,
          require: true,
          minlength: 5,
          maxlength: 50,
        },
        isGold: {
          type: Boolean,
          default: false,
        },
      }),
    },
    movie: {
      type: mongoose.Schema({
        title: {
          type: String,
          require: true,
          trim: true,
          minlength: 5,
          maxlength: 255,
        },
        dailyRentalRate: {
          type: Number,
          require: true,
          min: 0,
          max: 255,
        },
      }),
    },
    dateOut: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dateReturned: {
      type: Date,
    },
    rentalFee: {
      typed: Number,
      min: 0,
    },
  })
);

function validateRental(rental) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(rental);
}

module.exports.Rental = Rental;
module.exports.validate = validateRental;
