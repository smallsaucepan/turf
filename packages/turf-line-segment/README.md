# @turf/line-segment

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

## lineSegment

Creates a [FeatureCollection][1] of 2-vertex [LineString][2] segments from a
[(Multi)LineString][2] or [(Multi)Polygon][3].

### Parameters

*   `geojson` **[GeoJSON][4]** GeoJSON Polygon or LineString

### Examples

```javascript
var polygon = turf.polygon([[[-50, 5], [-40, -10], [-50, -10], [-40, 5], [-50, 5]]]);
var segments = turf.lineSegment(polygon);

//addToMap
var addToMap = [polygon, segments]
```

Returns **[FeatureCollection][1]<[LineString][2]>** 2-vertex line segments

[1]: https://tools.ietf.org/html/rfc7946#section-3.3

[2]: https://tools.ietf.org/html/rfc7946#section-3.1.4

[3]: https://tools.ietf.org/html/rfc7946#section-3.1.6

[4]: https://tools.ietf.org/html/rfc7946#section-3

<!-- This file is automatically generated. Please don't edit it directly. If you find an error, edit the source file of the module in question (likely index.js or index.ts), and re-run "yarn docs" from the root of the turf project. -->

---

This module is part of the [Turfjs project](https://turfjs.org/), an open source module collection dedicated to geographic algorithms. It is maintained in the [Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create PRs and issues.

### Installation

Install this single module individually:

```sh
$ npm install @turf/line-segment
```

Or install the all-encompassing @turf/turf module that includes all modules as functions:

```sh
$ npm install @turf/turf
```
