# @turf/buffer

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

## buffer

Calculates a buffer for input features for a given radius. Units supported are miles, kilometers, and degrees.

When using a negative radius, the resulting geometry may be invalid if
it's too small compared to the radius magnitude. If the input is a
FeatureCollection, only valid members will be returned in the output
FeatureCollection - i.e., the output collection may have fewer members than
the input, or even be empty.

### Parameters

*   `geojson` **([FeatureCollection][1] | [Geometry][2] | [Feature][3]\<any>)** Input to be buffered
*   `radius` **[number][4]** Distance to draw the buffer (negative values are allowed)
*   `options` **[Object][5]** Optional parameters (optional, default `{}`)

    *   `options.units` **Units** Units in which linear values are expressed (optional, default `"kilometers"`)
    *   `options.steps` **[number][4]** Number of steps (optional, default `8`)

### Examples

```javascript
const point = turf.point([-90.548630, 14.616599]);
const buffered = turf.buffer(point, 500, {units: 'miles'});

//addToMap
const addToMap = [point, buffered]
```

Returns **([FeatureCollection][1] | [Feature][3]<([Polygon][6] | [MultiPolygon][7])> | [undefined][8])** Buffered features

[1]: https://tools.ietf.org/html/rfc7946#section-3.3

[2]: https://tools.ietf.org/html/rfc7946#section-3.1

[3]: https://tools.ietf.org/html/rfc7946#section-3.2

[4]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number

[5]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[6]: https://tools.ietf.org/html/rfc7946#section-3.1.6

[7]: https://tools.ietf.org/html/rfc7946#section-3.1.7

[8]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined

<!-- This file is automatically generated. Please don't edit it directly. If you find an error, edit the source file of the module in question (likely index.js or index.ts), and re-run "yarn docs" from the root of the turf project. -->

---

This module is part of the [Turfjs project](https://turfjs.org/), an open source module collection dedicated to geographic algorithms. It is maintained in the [Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create PRs and issues.

### Installation

Install this single module individually:

```sh
$ npm install @turf/buffer
```

Or install the all-encompassing @turf/turf module that includes all modules as functions:

```sh
$ npm install @turf/turf
```
