"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
// const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for listings. */

class Listing {
  /** Create a listing (from data), update db, return new listing data.
   *
   * data should be { handle, name, description, numEmployees, logoUrl }
   *
   * Returns { handle, name, description, numEmployees, logoUrl }
   *
   * Throws BadRequestError if listing already in database.
   * */

  static async create({ handle, name, description, numEmployees, logoUrl }) {
    const duplicateCheck = await db.query(
          `SELECT handle
           FROM listings
           WHERE handle = $1`,
        [handle]);

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate listing: ${handle}`);

    const result = await db.query(
          `INSERT INTO listings
           (handle, name, description, num_employees, logo_url)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING handle, name, description, num_employees AS "numEmployees", logo_url AS "logoUrl"`,
        [
          handle,
          name,
          description,
          numEmployees,
          logoUrl,
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
                  photo_url AS "photoUrl"
           FROM listings
           ORDER BY zipcode`);
    return listingsRes.rows;
  }

  /** Given a listing handle, return data about listing.
   *
   * Returns { handle, name, description, numEmployees, logoUrl, jobs }
   *   where jobs is [{ id, title, salary, equity }, ...]
   *
   * Throws NotFoundError if not found.
   **/

  static async get(handle) {
    const listingRes = await db.query(
          `SELECT handle,
                  name,
                  description,
                  num_employees AS "numEmployees",
                  logo_url AS "logoUrl"
           FROM listings
           WHERE handle = $1`,
        [handle]);

    const listing = listingRes.rows[0];

    if (!listing) throw new NotFoundError(`No listing: ${handle}`);
    
    // Get all the jobs for this listing
    listing.jobs = await Job.findAllBylistingHandle(handle);

    return listing;
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

  static async remove(handle) {
    const result = await db.query(
          `DELETE
           FROM listings
           WHERE handle = $1
           RETURNING handle`,
        [handle]);
    const listing = result.rows[0];

    if (!listing) throw new NotFoundError(`No listing: ${handle}`);
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
