"use strict";

const db = require("../db");
const { BadRequestError} = require("../expressError");

/** Related functions for messages. */
class Message {
  /** Create a message (from data), update db, return new message data.
   *
   * { id, toId, fromId, content, sentAt, threadId }
   *
   * Throws BadRequestError if message already in database.
   * */
  static async create({ toId, fromId, content, threadId }) {
    // TODO: check that thread exists (checking in the db sometime)
    if(!threadId) throw new BadRequestError("No thread id");

    const result = await db.query(
          `INSERT INTO messages
           (to_id, from_id, content, thread_id)
           VALUES ($1, $2, $3, $4)
           RETURNING id,
                     to_id AS "toId",
                     from_id AS "fromId",
                     content,
                     sent_at AS "sentAt",
                     thread_id AS "threadId"`,
        [toId, fromId, content, threadId]
    );
    const message = result.rows[0];

    return message;
  }

  /** Given a message thread info (userId1 and userId2), return data about messages.
   *
   * Returns [{ id, toId, fromId, content, sentAt, threadId }, ...]
   **/
  static async getConversation(userId1, userId2) {
    const messageRes = await db.query(
          `SELECT id,
                  to_id AS "toId",
                  from_id AS "fromId",
                  content,
                  sent_at AS "sentAt",
                  thread_id AS "threadId"
           FROM messages
           WHERE (from_id = $1 AND to_id = $2) OR
                 (from_id = $2 AND to_id = $1)
           ORDER BY sent_at`,
        [userId1, userId2]);

    const messages = messageRes.rows;

    return messages;
  }

  /** Given a message thread id, return data about messages.
   *
   * Returns [{ id, toId, fromId, content, sentAt }, ...]
   */
  static async getMessagesFromThread(threadId) {
    const messageRes = await db.query(
          `SELECT id,
                  to_id AS "toId",
                  from_id AS "fromId",
                  content,
                  sent_at AS "sentAt"
           FROM messages
           WHERE thread_id = $1
           ORDER BY sent_at`,
        [threadId]);

    const messages = messageRes.rows;

    return messages;
  }
}

module.exports = Message;
