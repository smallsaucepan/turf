import { BBox, Feature, Polygon, GeoJsonProperties } from "geojson";
import { polygon } from "@turf/helpers";

/**
 * Takes a bbox and returns an equivalent {@link Polygon|polygon}.
 *
 * @function
 * @param {BBox} bbox Extent in [minX, minY, maxX, maxY] order
 * @param {Object} [options={}] Optional parameters
 * @param {GeoJsonProperties} [options.properties={}] Properties to set on returned feature
 * @param {string|number} [options.id={}] Id to set on returned feature
 * @returns {Feature<Polygon>} Polygon representing the bounding box
 * @example
 * const bbox = [0, 0, 10, 10];
 *
 * const poly = turf.bboxPolygon(bbox);
 *
 * //addToMap
 * const addToMap = [poly]
 */
function bboxPolygon<P extends GeoJsonProperties = GeoJsonProperties>(
  bbox: BBox,
  options: {
    properties?: P;
    id?: string | number;
  } = {}
): Feature<Polygon, P> {
  // Convert BBox positions to Numbers
  // No performance loss for including Number()
  // https://github.com/Turfjs/turf/issues/1119
  const west = Number(bbox[0]);
  const south = Number(bbox[1]);
  const east = Number(bbox[2]);
  const north = Number(bbox[3]);

  if (bbox.length === 6) {
    throw new Error(
      "@turf/bbox-polygon does not support BBox with 6 positions"
    );
  }

  const lowLeft = [west, south];
  const topLeft = [west, north];
  const topRight = [east, north];
  const lowRight = [east, south];

  return polygon(
    [[lowLeft, lowRight, topRight, topLeft, lowLeft]],
    options.properties,
    { bbox, id: options.id }
  );
}

export { bboxPolygon };
export default bboxPolygon;
