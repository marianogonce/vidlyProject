const mongoose = require("mongoose");
const { genreSchema } = require("./genre.js");
const Joi = require("joi");

const Movie = mongoose.model(
  "Movie",
  new mongoose.Schema({
    title: {
      type: String,
      require: true,
      trim: true,
      minlength: 5,
      maxlength: 255,
    },
    genre: { type: genreSchema, require: true },
    numberInStock: {
      type: Number,
      require: true,
      min: 0,
      max: 255,
    },
    dailyRentalRate: {
      type: Number,
      require: true,
      min: 0,
      max: 255,
    },
  })
);

function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(255).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).max(255).required(),
    dailyRentalRate: Joi.number().min(0).max(255).required(),
  });

  return schema.validate(movie);
}

module.exports.Movie = Movie;
module.exports.validate = validateMovie;
