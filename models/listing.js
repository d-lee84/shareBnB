"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
// const { sqlForPartialUpdate } = require("../helpers/sql");

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
                       photo_url,
                       host_id }) {
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
                      photo_url,
                      host_id`,
        [
          name,
          price,
          zipcode,
          capacity,
          description,
          amenities,
          photo_url,
          host_id
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
   * Returns [ { id, name, price, zipcode, capacity, photoUrl }, ...]

   *   where jobs is [{ id, title, salary, equity }, ...]
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

    // TODO: Add host information to the listing
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

  /** Update listing data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: {name, description, numEmployees, logoUrl}
   *
   * Returns {handle, name, description, numEmployees, logoUrl}
   *
   * Throws NotFoundError if not found.
   */

  static async update(handle, data) {
    const { setCols, values } = sqlForPartialUpdate(
        data,
        {
          numEmployees: "num_employees",
          logoUrl: "logo_url",
        });
    const handleVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE listings
                      SET ${setCols}
                      WHERE handle = ${handleVarIdx}
                      RETURNING handle,
                                name,
                                description,
                                num_employees AS "numEmployees",
                                logo_url AS "logoUrl"`;
    const result = await db.query(querySql, [...values, handle]);
    const listing = result.rows[0];

    if (!listing) throw new NotFoundError(`No listing: ${handle}`);

    return listing;
  }

  /** Delete given listing from database; returns undefined.
   *
   * Throws NotFoundError if listing not found.
   **/

  static async remove(id) {
    const result = await db.query(
          `DELETE
           FROM listings
           WHERE id = $1
           RETURNING id`,
        [id]);
    const listing = result.rows[0];

    if (!listing) throw new NotFoundError(`No listing: ${id}`);
  }

  /** Translate data to filter into SQL Format.
 * Takes in:
 *  filterBy: JS object with key-value pairs to filter in database
 *
 * Returns:
 *  whereCols: string that contains the where clause of the SQL query
 *             if filterBy has minEmployees, maxEmployees or name
 *             - empty string if the keys above are not present
 *  values: array of values to search by in the SQL query
 *          - empty array if keys are not present
 *
 *  Example:
 * {
 *    whereCols: "WHERE num_employees >= $1 AND name ILIKE $2",
 *    values: [4, '%searchTerm%']
 * }
 *
*/

static _sqlForPartialFilter(filters={}) {
  if (Object.keys(filters).length === 0) {
    return {
      whereClauses: '',
      values: [],
    }
  }

  const whereClauses = [];
  const values = [];
  const {minEmployees, maxEmployees, name} = filters;

  if (minEmployees && maxEmployees && +minEmployees > +maxEmployees) {
    throw new BadRequestError(
      `Min employees: ${minEmployees} cannot be larger than max
        employees: ${maxEmployees}`);
  }

  if (minEmployees !== undefined) {
    whereClauses.push(`num_employees >= $${whereClauses.length + 1}`);
    values.push(minEmployees);
  }

  if (maxEmployees !== undefined) {
    whereClauses.push(`num_employees <= $${whereClauses.length + 1}`);
    values.push(maxEmployees);
  }

  if (name !== undefined) {
    whereClauses.push(`name ILIKE $${whereClauses.length + 1}`);
    values.push(`%${name}%`);
  }

  return {
    whereClauses: 'WHERE ' + whereClauses.join(" AND "),
    values,
  };
}
}


module.exports = Listing;
