// Taken from http://geomalgorithms.com/a02-_lines.html
import { Feature, LineString } from "geojson";
import {
  convertLength,
  Coord,
  feature,
  lineString,
  point,
  Units,
} from "@turf/helpers";
import { nearestPointOnLine } from "@turf/nearest-point-on-line";
import { featureOf } from "@turf/invariant";
import { segmentEach } from "@turf/meta";
import { rhumbDistance } from "@turf/rhumb-distance";

/**
 * Calculates the distance between a given point and the nearest point on a
 * line. Sometimes referred to as the cross track distance.
 *
 * @function
 * @param {Feature<Point>|Array<number>} pt Feature or Geometry
 * @param {Feature<LineString>} line GeoJSON Feature or Geometry
 * @param {Object} [options={}] Optional parameters
 * @param {Units} [options.units="kilometers"] Supports all valid Turf {@link https://turfjs.org/docs/api/types/Units Units}
 * @param {string} [options.method="geodesic"] whether to calculate the distance based on geodesic (spheroid) or
 * planar (flat) method. Valid options are 'geodesic' or 'planar'.
 * @returns {number} distance between point and line
 * @example
 * var pt = turf.point([0, 0]);
 * var line = turf.lineString([[1, 1],[-1, 1]]);
 *
 * var distance = turf.pointToLineDistance(pt, line, {units: 'miles'});
 * //=69.11854715938406
 */
function pointToLineDistance(
  pt: Coord,
  line: Feature<LineString> | LineString,
  options: {
    units?: Units;
    method?: "geodesic" | "planar";
  } = {}
): number {
  // Optional parameters
  const method = options.method ?? "geodesic";
  const units = options.units ?? "kilometers";

  // validation
  if (!pt) {
    throw new Error("pt is required");
  }
  if (Array.isArray(pt)) {
    pt = point(pt);
  } else if (pt.type === "Point") {
    pt = feature(pt);
  } else {
    featureOf(pt, "Point", "point");
  }

  if (!line) {
    throw new Error("line is required");
  }
  if (Array.isArray(line)) {
    line = lineString(line);
  } else if (line.type === "LineString") {
    line = feature(line);
  } else {
    featureOf(line, "LineString", "line");
  }

  let distance = Infinity;
  const p = pt.geometry.coordinates;
  segmentEach(line, (segment) => {
    if (segment) {
      const a = segment.geometry.coordinates[0];
      const b = segment.geometry.coordinates[1];
      const d = distanceToSegment(p, a, b, { method });
      if (d < distance) {
        distance = d;
      }
    }
  });
  return convertLength(distance, "degrees", units);
}

/**
 * Returns the distance between a point P on a segment AB.
 *
 * @private
 * @param {Array<number>} p external point
 * @param {Array<number>} a first segment point
 * @param {Array<number>} b second segment point
 * @param {Object} [options={}] Optional parameters
 * @returns {number} distance
 */
function distanceToSegment(
  p: number[], // point to measure from
  a: number[], // start point of the segment to measure to
  b: number[], // end point of the segment to measure to
  options: {
    method: "geodesic" | "planar";
  }
) {
  // Internally just use degrees, and then convert to the user's requested units
  // in the calling function.
  if (options.method === "geodesic") {
    // Use nearestPointOnLine to properly calculate distances on a spherical
    // Earth.
    const nearest = nearestPointOnLine(lineString([a, b]).geometry, p, {
      units: "degrees",
    });
    return nearest.properties.dist;
  }

  // Perform scalar calculations instead using rhumb lines.
  const v = [b[0] - a[0], b[1] - a[1]];
  const w = [p[0] - a[0], p[1] - a[1]];

  const c1 = dot(w, v);
  if (c1 <= 0) {
    return rhumbDistance(p, a, { units: "degrees" });
  }
  const c2 = dot(v, v);
  if (c2 <= c1) {
    return rhumbDistance(p, b, { units: "degrees" });
  }
  const b2 = c1 / c2;
  const Pb = [a[0] + b2 * v[0], a[1] + b2 * v[1]];

  return rhumbDistance(p, Pb, { units: "degrees" });
}

function dot(u: number[], v: number[]) {
  return u[0] * v[0] + u[1] * v[1];
}

export { pointToLineDistance };
export default pointToLineDistance;
