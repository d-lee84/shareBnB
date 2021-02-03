"use strict";

/** Routes for listings. */

// const jsonschema = require("jsonschema");
const express = require("express");

const multer = require('multer');
const upload = multer();
const { uploadToS3Bucket } = require('../helpers/aws');
const { BadRequestError } = require("../expressError");
const { ensureAdmin, ensureLoggedIn } = require("../middleware/auth");
const Listing = require("../models/listing");

// const listingNewSchema = require("../schemas/listingNew.json");
// const listingUpdateSchema = require("../schemas/listingUpdate.json");
// const listingsFilterSchema = require("../schemas/listingsFilter.json");

const router = new express.Router();


/** POST / { listing } =>  { listing }
 *
 * listing should be { name, price, zipcode, capacity, description, amenities, photo..., hostId }
 *
 * Returns { id, name, price, zipcode, capacity, description, amenities, photoUrl, hostId }
 *
 * Authorization required: logged in
 */

router.post("/", ensureLoggedIn, upload.array('photo', 1), async function (req, res, next) {
  // req.body has the text inputs
  // req.files has the array of files
  // const validator = jsonschema.validate(req.body, listingNewSchema);
  // if (!validator.valid) {
  //   const errs = validator.errors.map(e => e.stack);
  //   throw new BadRequestError(errs);
  // }
  const image = req.files[0];
  console.log(image);
  uploadToS3Bucket(image);
  const listing = await Listing.create(req.body);
  return res.status(201).json({ listing });
});

/** GET /listings  =>
 *   { listings: [ { id, name, price, zipcode, capacity, photo_url }, ...] }
 *
 * Can filter on provided search filters:
 * - nameLike (will find case-insensitive, partial matches)
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
  // const validator = jsonschema.validate(req.query, listingsFilterSchema);
  // if (!validator.valid) {
  //   const errs = validator.errors.map(e => e.stack);
  //   throw new BadRequestError(errs);
  // }

  const listings = await Listing.findAll();
  return res.json({ listings });
});

/** GET /listings/search  =>  { listing }
 *  Gets filtered listings for search
 *  listing is
 *    { id, name, price, zipcode, capacity, photo_url, description, amenities, host }
 *   where host is {username, first_name, last_name }
 *
 * Authorization required: none
 */

router.get("/search", async function (req, res, next) {
  const q = req.query;
  const listings = await Listing.search(q.term);
  return res.json({ listings });
});

/** GET /listings/[id]  =>  { listing }
 *  Gets a single listing for Listing Detail page.
 *  listing is
 *    { id, name, price, zipcode, capacity, photo_url, description, amenities, host }
 *
 *   where host is {username, first_name, last_name }
 *
 * Authorization required: none
 */

router.get("/:id", async function (req, res, next) {
  const listing = await Listing.get(req.params.id);
  return res.json({ listing });
});


/** PATCH /[handle] { fld1, fld2, ... } => { listing }
 *
 * Patches listing data.
 *
 * fields can be: { name, description, numEmployees, logo_url }
 *
 * Returns { handle, name, description, numEmployees, logo_url }
 *
 * Authorization required: admin
 */

// router.patch("/:handle", ensureAdmin, async function (req, res, next) {
//   const validator = jsonschema.validate(req.body, listingUpdateSchema);
//   if (!validator.valid) {
//     const errs = validator.errors.map(e => e.stack);
//     throw new BadRequestError(errs);
//   }

//   const listing = await Listing.update(req.params.handle, req.body);
//   return res.json({ listing });
// });

/** DELETE /[handle]  =>  { deleted: handle }
 *
 * Authorization: admin
 */

router.delete("/:id", ensureAdmin, async function (req, res, next) {
  await Listing.remove(req.params.id);
  return res.json({ deleted: req.params.id });
});


module.exports = router;
