"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");

/** Related functions for listings. */

class Listing {
  /** Create a listing (from data), update db, return new listing data.
   *
   * { name, price, zipcode, capacity, description, amenities, photo_url, host_id }
   *
   * Throws BadRequestError if listing already in database.
   * */

  static async create({name,
                       price,
                       zipcode,
                       capacity,
                       description,
                       amenities,
                       photoUrl,
                       hostId }) {
    const result = await db.query(
          `INSERT INTO listings
           (name,
            price,
            zipcode,
            capacity,
            description,
            amenities,
            photo_url,
            host_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING  name,
                      price,
                      zipcode,
                      capacity,
                      description,
                      amenities,
                      photo_url AS "photoUrl",
                      host_id`,
        [
          name,
          price,
          zipcode,
          capacity,
          description,
          amenities,
          photoUrl,
          hostId
        ],
    );
    const listing = result.rows[0];

    return listing;
  }

  /** Find all listings.
   *
   * Takes in optional filter object which can include:
   *  {name}
   *
   * Returns [ { id, name, price, zipcode, capacity, photoUrl }, ...]
   * */

  static async findAll() {
    // const { whereClauses, values } = listing._sqlForPartialFilter(filterBy);
    const listingsRes = await db.query(
          `SELECT id,
                  name,
                  price,
                  zipcode,
                  capacity,
                  amenities,
                  photo_url AS "photoUrl"
           FROM listings
           ORDER BY zipcode`);
    return listingsRes.rows;
  }

  /** Given a listing handle, return data about listing.
   *
   * Returns { id, name, description, price, zipcode, 
   *          capacity, amenities, photoUrl, host }
   *   where host is { id, username, firstName, lastName }
   *
   * Throws NotFoundError if not found.
   **/

  static async get(id) {
    const listingRes = await db.query(
          `SELECT id,
                  name,
                  description,
                  price,
                  zipcode,
                  capacity,
                  amenities,
                  host_id AS "hostId",
                  photo_url AS "photoUrl"
           FROM listings
           WHERE id = $1`,
        [id]);

    const listing = listingRes.rows[0];

    if (!listing) throw new NotFoundError(`No listing: ${handle}`);

    const hostRes = await db.query(
      `SELECT id,
              username,
              first_name AS "firstName",
              last_name AS "lastName"
           FROM users
           WHERE id = $1`,
      [listing.hostId],
    );

    const host = hostRes.rows[0];

    listing.host = host;
    delete listing.hostId;

    return listing;
  }

  /** Given a search term, return relevant listings.
   *
   * Returns [ { id, name, price, zipcode, capacity, amenitites, photoUrl }, ...]
   *
   * Throws NotFoundError if not found.
   **/

  static async search(term) {
    const listingRes = await db.query(
          `SELECT id,
                  name,
                  price,
                  zipcode,
                  capacity,
                  amenities,
                  photo_url AS "photoUrl"
           FROM listings
           WHERE name ILIKE $1`,
        [`%${term}%`]);

    const listings = listingRes.rows;

    if (!listings[0]) throw new NotFoundError(`No listings matched term: ${term}`);

    return listings;
  }
}


module.exports = Listing;
