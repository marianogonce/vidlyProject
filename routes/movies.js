const { Movie, validate } = require("../models/movie.js");
const { Genre } = require("../models/genre.js");
const express = require("express");
const { isValidObjectId } = require("../utils/isValidObjectID.js");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncMiddleware = require("../middleware/async");

router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const movies = await Movie.find().sort("title");
    res.send(movies);
  })
);

router.post(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);

    if (!genre) return res.status(400).send("Invalid genre");

    const movie = new Movie({
      title: req.body.title,
      genre: {
        id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    });
    await movie.save();
    res.send(movie);
  })
);

router.put(
  "/:id",
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);

    if (!genre) return res.status(400).send("Invalid genre");

    let movie;
    if (isValidObjectId(req.params.id)) {
      movie = await Movie.findByIdAndUpdate(
        req.params.id,
        {
          title: req.body.title,
          genre: {
            id: genre._id,
            name: genre.name,
          },
          numberInStock: req.body.numberInStock,
          dailyRentalRate: req.body.dailyRentalRate,
        },
        { new: true }
      );
    } else {
      movie = false;
    }
    if (!movie)
      return res.status(404).send("The movie with the given ID was not found.");
    res.send(movie);
  })
);

router.delete(
  "/:id",
  [auth, admin],
  asyncMiddleware(async (req, res) => {
    let movie;
    if (isValidObjectId(req.params.id)) {
      movie = await Movie.findByIdAndRemove(req.params.id);
    } else {
      movie = false;
    }
    if (!movie)
      return res.status(404).send("The movie with the given ID was not found.");

    res.send(movie);
  })
);

router.get(
  "/:id",
  asyncMiddleware(async (req, res) => {
    let movie;
    if (isValidObjectId(req.params.id)) {
      movie = await Movie.findById(req.params.id);
    } else {
      movie = false;
    }
    if (!movie)
      return res.status(404).send("The movie with the given ID was not found.");
    res.send(movie);
  })
);

module.exports = router;
