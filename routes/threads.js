"use strict";

/** Routes for Thread. */
const express = require("express");
const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, ensureAdminOrSelf } = require("../middleware/auth");
const Thread = require("../models/thread");
const router = new express.Router();

/** GET /threads/:userId  =>
 *   { threads: [ { id, listingId, hostId, guestId, startedAt }, ...] }
 *
 * Authorization required: Admin or self
 */

router.get("/:userId", ensureAdminOrSelf, async function (req, res, next) {
  const userId = req.params.userId;

  const threads = await Thread.getAllThreadsForUser(userId);
  return res.json({ threads });
});


/** POST /threads  =>
 *   { thread: { id, listingId, hostId, guestId, startedAt } }
 *
 * Authorization required: LoggedIn
 */

router.post("/", ensureLoggedIn, async function (req, res, next) {
  const { listingId, hostId, guestId } = req.body
  const thread = await Thread.create({ listingId, hostId, guestId });
  return res.json({ thread });
});

module.exports = router;
