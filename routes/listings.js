"use strict";

/** Routes for listings. */

const express = require("express");

const multer = require('multer');
const upload = multer();
const { uploadToS3Bucket } = require('../helpers/aws');
const { ensureLoggedIn } = require("../middleware/auth");
const Listing = require("../models/listing");

const router = new express.Router();


/** POST / { listing } =>  { listing }
 *
 * listing should be 
 *  { name, price, zipcode, capacity, description, amenities, photoUrl, hostId }
 *
 * Returns { id, name, price, zipcode, capacity, description, amenities, photoUrl, hostId }
 *
 * Authorization required: logged in
 */

router.post("/", ensureLoggedIn, upload.array('photo', 1), async function (req, res, next) {
  // req.body has the text inputs
  // req.files has the array of files
  const image = req.files[0];

  const fileName = await uploadToS3Bucket(image);
  
  req.body.photoUrl = fileName;
  const listing = await Listing.create(req.body);
  return res.status(201).json({ listing });
});

/** GET /listings  =>
 *   { listings: [{ id, name, price, zipcode, capacity, amenities, photoUrl }, ...] }
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
  const listings = await Listing.findAll();
  return res.json({ listings });
});

/** GET /listings/search  =>  { listings }
 * 
 *  Gets filtered listings for search
 *  listings is
 *    [{ id, name, price, zipcode, capacity, amenities, photoUrl }, ...]
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
 *   where host is {id, username, first_name, last_name }
 *
 * Authorization required: none
 */
router.get("/:id", async function (req, res, next) {
  const listing = await Listing.get(req.params.id);
  return res.json({ listing });
});

module.exports = router;
