"use strict";

/** Routes for messages. */
const express = require("express");
const { BadRequestError } = require("../expressError");
const { ensureAdmin, ensureLoggedIn } = require("../middleware/auth");
const Message = require("../models/message");
const Thread = require("../models/thread");

// const messageNewSchema = require("../schemas/messageNew.json");
// const messageUpdateSchema = require("../schemas/messageUpdate.json");
// const messagesFilterSchema = require("../schemas/messagesFilter.json");

const router = new express.Router();


/** POST / { message } =>  { message }
 *
 * message: { id, toId, fromId, content, sentAt, threadId }
 *
 * Returns { id, toId, fromId, content, sentAt }
 *
 * Authorization required: logged in
 */

router.post("/", ensureLoggedIn, async function (req, res, next) {
  // const validator = jsonschema.validate(req.body, messageNewSchema);
  // if (!validator.valid) {
  //   const errs = validator.errors.map(e => e.stack);
  //   throw new BadRequestError(errs);
  // }
  const { toId, fromId, content, threadId } = req.body;
  const message = await Message.create({ toId, fromId, content, threadId });
  return res.status(201).json({ message });
});

/** GET /messages  =>
 *   { messages: [ { id, name, price, zipcode, capacity, photo_url }, ...] }
 *
 * Can filter on provided search filters:
 * - nameLike (will find case-insensitive, partial matches)
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
  // const validator = jsonschema.validate(req.query, messagesSchema);
  // if (!validator.valid) {
  //   const errs = validator.errors.map(e => e.stack);
  //   throw new BadRequestError(errs);
  // }
  const userId = req.query.threadId;

  const messages = await Message.getMessagesFromThread();
  return res.json({ messages });
});


/** GET /messages/[id]  =>  { message }
 *  Gets a single message for message Detail page.
 *  message is
 *    { id, name, price, zipcode, capacity, photo_url, description, amenities, host }
 *
 *   where host is {username, first_name, last_name }
 *
 * Authorization required: none
 */

router.get("/:threadId", async function (req, res, next) {
  const threadId = req.params.threadId;
  const messages = await Message.getMessagesFromThread(threadId);
  return res.json({ messages });
});


/** PATCH /[handle] { fld1, fld2, ... } => { message }
 *
 * Patches message data.
 *
 * fields can be: { name, description, numEmployees, logo_url }
 *
 * Returns { handle, name, description, numEmployees, logo_url }
 *
 * Authorization required: admin
 */

// router.patch("/:handle", ensureAdmin, async function (req, res, next) {
//   const validator = jsonschema.validate(req.body, messageUpdateSchema);
//   if (!validator.valid) {
//     const errs = validator.errors.map(e => e.stack);
//     throw new BadRequestError(errs);
//   }

//   const message = await message.update(req.params.handle, req.body);
//   return res.json({ message });
// });

/** DELETE /[handle]  =>  { deleted: handle }
 *
 * Authorization: admin
 */

router.delete("/:id", ensureAdmin, async function (req, res, next) {
  await message.remove(req.params.id);
  return res.json({ deleted: req.params.id });
});


module.exports = router;
