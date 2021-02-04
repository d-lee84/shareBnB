"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

/** Related functions for threads. */
class Thread {
  /** Create a thread (from data), update db, return new thread data.
   *
   * { id, listingId, startedAt }
   *
   * Throws BadRequestError if thread already in database.
   * */
  static async create({ listingId }) {
    const result = await db.query(
          `INSERT INTO threads
           (listing_id)
           VALUES ($1)
           RETURNING id,
                     listing_id AS "listingId"
                     started_at AS "startedAt"`,
        [listingId]
    );
    const thread = result.rows[0];

    return thread;
  }
}

module.exports = Thread;
