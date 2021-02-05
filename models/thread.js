"use strict";

const { user } = require("../db");
const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

/** Related functions for threads. */
class Thread {
  /** Create a thread (from data), update db, return new thread data.
   *
   * { id, listingId, startedAt }
   *Schema:
        id SERIAL PRIMARY KEY,
        listing_id INTEGER REFERENCES listings,
        host_id INTEGER REFERENCES users,
        guest_id INTEGER REFERENCES users,
        started_at timestamp DEFAULT NOW()
   *
   * */
  static async create({ listingId, hostId, guestId }) {
    const result = await db.query(
          `INSERT INTO message_threads
           (listing_id, host_id, guest_id)
           VALUES ($1, $2, $3)
           RETURNING id,
                     listing_id AS "listingId",
                     started_at AS "startedAt"`,
        [listingId, hostId, guestId]
    );
    const thread = result.rows[0];

    return thread;
  }

  /** Get all threads for a user
   * { id, listingId, hostId, guestId, startedAt }
   */
  static async getAllThreadsForUser({userId}){
    const result = await db.query(
        `SELECT id,
                listing_id AS "listingId",
                host_id AS "hostId,
                guest_id AS "guestId"
                started_at AS "startedAt"
        FROM    message_threads
        WHERE   host_id=$1
        OR      guest_id=$1`,
      [userId]);
    const threads = result.rows;
    return threads;
  }
}

module.exports = Thread;
