"use strict";

/** Routes for users. */

const express = require("express");
const { ensureLoggedIn } = require("../middleware/auth");
const User = require("../models/user");

const router = express.Router();

/** GET users/[username] => { user }
 *
 * Returns { username, firstName, lastName, isAdmin }
 *      
 * Authorization required: logged in 
 **/

router.get("/:username", ensureLoggedIn, async function (req, res, next) {
  const user = await User.get(req.params.username);
  return res.json({ user });
});

module.exports = router;
