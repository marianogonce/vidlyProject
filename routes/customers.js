const { Customer, validate } = require("../models/customer.js");
const express = require("express");
const router = express.Router();
const { isValidObjectId } = require("../utils/isValidObjectID.js");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncMiddleware = require("../middleware/async");

router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const customers = await Customer.find().sort("name");
    res.send(customers);
  })
);

router.post(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = new Customer({
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold,
    });
    await customer.save();
    res.send(customer);
  })
);

router.put(
  "/:id",
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let customer;
    if (isValidObjectId(req.params.id)) {
      customer = await Customer.findByIdAndUpdate(
        req.params.id,
        { name: req.body.name, phone: req.body.phone, isGold: req.body.isGold },
        { new: true }
      );
    } else {
      customer = false;
    }
    if (!customer)
      return res
        .status(404)
        .send("The customer with the given ID was not found.");
    res.send(customer);
  })
);

router.delete(
  "/:id",
  [auth, admin],
  asyncMiddleware(async (req, res) => {
    let customer;
    if (isValidObjectId(req.params.id)) {
      customer = await Customer.findByIdAndRemove(req.params.id);
    } else {
      customer = false;
    }
    if (!customer)
      return res
        .status(404)
        .send("The customer with the given ID was not found.");

    res.send(customer);
  })
);

router.get(
  "/:id",
  asyncMiddleware(async (req, res) => {
    let customer;
    if (isValidObjectId(req.params.id)) {
      customer = await Customer.findById(req.params.id);
    } else {
      customer = false;
    }
    if (!customer)
      return res
        .status(404)
        .send("The customer with the given ID was not found.");
    res.send(customer);
  })
);

module.exports = router;
