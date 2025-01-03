import { lineString } from "@turf/helpers";
import { getCoord } from "@turf/invariant";
import { GreatCircle } from "./lib/arc.js";

/**
 * Calculate great circles routes as {@link LineString} or {@link MultiLineString}.
 * If the `start` and `end` points span the antimeridian, the resulting feature will
 * be split into a `MultiLineString`. If the `start` and `end` positions are the same
 * then a `LineString` will be returned with duplicate coordinates the length of the `npoints` option.
 *
 * @function
 * @param {Coord} start source point feature
 * @param {Coord} end destination point feature
 * @param {Object} [options={}] Optional parameters
 * @param {GeoJsonProperties} [options.properties={}] Properties to set on returned feature
 * @param {number} [options.npoints=100] number of points
 * @param {number} [options.offset=10] offset controls the likelyhood that lines will
 * be split which cross the dateline. The higher the number the more likely.
 * @returns {Feature<LineString | MultiLineString>} great circle line feature
 * @example
 * const start = turf.point([-122, 48]);
 * const end = turf.point([-77, 39]);
 *
 * const greatCircle = turf.greatCircle(start, end, {properties: {name: 'Seattle to DC'}});
 *
 * //addToMap
 * const addToMap = [start, end, greatCircle]
 */
function greatCircle(start, end, options) {
  // Optional parameters
  options = options || {};
  if (typeof options !== "object") throw new Error("options is invalid");
  var properties = options.properties;
  var npoints = options.npoints;
  var offset = options.offset;

  start = getCoord(start);
  end = getCoord(end);

  properties = properties || {};
  npoints = npoints || 100;

  if (start[0] === end[0] && start[1] === end[1]) {
    const arr = Array(npoints);
    arr.fill([start[0], start[1]]);
    return lineString(arr, properties);
  }

  offset = offset || 10;

  var generator = new GreatCircle(
    { x: start[0], y: start[1] },
    { x: end[0], y: end[1] },
    properties
  );

  var line = generator.Arc(npoints, { offset: offset });

  return line.json();
}

export { greatCircle };
export default greatCircle;
