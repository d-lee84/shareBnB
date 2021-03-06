"use strict";

const db = require("../db");

/** Related functions for threads. */
class Thread {
  /** Create a thread (from data), update db, return new thread data.
   *
   *  Returns { id, listingId, startedAt }
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

  /** Get all threads for a host
   * [{ id, listingId, hostId, guestId, startedAt, fromUsername }, ...]
   */
  static async getThreadsForHost(hostId){
    console.log(hostId);
    const result = await db.query(
        `SELECT mt.id,
                listing_id AS "listingId",
                host_id AS "hostId",
                guest_id AS "guestId",
                started_at AS "startedAt",
                username AS "fromUsername"
        FROM    message_threads mt
        JOIN users u ON guest_id = u.id
        WHERE   host_id=$1`,
      [hostId]);

    const threads = result.rows;
    console.log(threads);
    return threads;
  }

  /** Get all threads for a guest
   * [{ id, listingId, hostId, guestId, startedAt, fromUsername }, ...]
   */
  static async getThreadsForGuest(guestId){
    const result = await db.query(
        `SELECT mt.id,
                listing_id AS "listingId",
                host_id AS "hostId",
                guest_id AS "guestId",
                started_at AS "startedAt",
                username AS "fromUsername"
        FROM    message_threads mt
        JOIN users u ON host_id = u.id
        WHERE  guest_id=$1`,
      [guestId]);

    const threads = result.rows;
    return threads;
  }
}

module.exports = Thread;
