"use strict";

/** Routes for messages. */
const express = require("express");
const { BadRequestError } = require("../expressError");
const { ensureLoggedIn } = require("../middleware/auth");
const Message = require("../models/message");

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
  const { toId, fromId, content, threadId } = req.body;
  const message = await Message.create({ toId, fromId, content, threadId });
  return res.status(201).json({ message });
});

/** GET /messages/[threadId]  =>  { messages }
 *  Gets a single message by threadId for message Detail page.
 * 
 * Returns [message, ...]
 *  where message is
 *    { id, toId, fromId, content, sentAt }
 * 
 * Authorization required: logged in
 */

router.get("/:threadId", ensureLoggedIn, async function (req, res, next) {
  const threadId = req.params.threadId;
  const messages = await Message.getMessagesFromThread(threadId);
  return res.json({ messages });
});


module.exports = router;
