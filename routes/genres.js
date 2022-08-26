const { Genre, validate } = require("../models/genre");
const express = require("express");
const router = express.Router();
const { isValidObjectId } = require("../utils/isValidObjectID.js");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncMiddleware = require("../middleware/async");

router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const genres = await Genre.find().sort("name");
    res.send(genres);
  })
);

router.post(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = new Genre({ name: req.body.name });
    await genre.save();
    res.send(genre);
  })
);

router.put(
  "/:id",
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let genre;
    if (isValidObjectId(req.params.id)) {
      genre = await Genre.findByIdAndUpdate(
        req.params.id,
        { name: req.body.name },
        { new: true }
      );
    } else {
      genre = false;
    }
    if (!genre)
      return res.status(404).send("The genre with the given ID was not found.");
    res.send(genre);
  })
);

router.delete(
  "/:id",
  [auth, admin],
  asyncMiddleware(async (req, res) => {
    let genre;
    if (isValidObjectId(req.params.id)) {
      genre = await Genre.findByIdAndRemove(req.params.id);
    } else {
      genre = false;
    }
    if (!genre)
      return res.status(404).send("The genre with the given ID was not found.");

    res.send(genre);
  })
);

router.get(
  "/:id",
  asyncMiddleware(async (req, res) => {
    let genre;
    if (isValidObjectId(req.params.id)) {
      genre = await Genre.findById(req.params.id);
    } else {
      genre = false;
    }
    if (!genre)
      return res.status(404).send("The genre with the given ID was not found.");
    res.send(genre);
  })
);

module.exports = router;
