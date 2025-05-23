# @turf/rhumb-destination

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

## rhumbDestination

Returns the destination [Point][1] having travelled the given distance along a Rhumb line from the
origin Point with the (varant) given bearing.

### Parameters

*   `origin` **[Coord][2]** starting point
*   `distance` **[number][3]** distance from the starting point
*   `bearing` **[number][3]** varant bearing angle ranging from -180 to 180 degrees from north
*   `options` **[Object][4]** Optional parameters (optional, default `{}`)

    *   `options.units` **Units** Supports all valid Turf [Units][5] (optional, default `'kilometers'`)
    *   `options.properties` **[Object][4]** translate properties to destination point (optional, default `{}`)

### Examples

```javascript
var pt = turf.point([-75.343, 39.984], {"marker-color": "F00"});
var distance = 50;
var bearing = 90;
var options = {units: 'miles'};

var destination = turf.rhumbDestination(pt, distance, bearing, options);

//addToMap
var addToMap = [pt, destination]
destination.properties['marker-color'] = '#00F';
```

Returns **[Feature][6]<[Point][1]>** Destination point.

[1]: https://tools.ietf.org/html/rfc7946#section-3.1.2

[2]: https://tools.ietf.org/html/rfc7946#section-3.1.1

[3]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number

[4]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[5]: https://turfjs.org/docs/api/types/Units

[6]: https://tools.ietf.org/html/rfc7946#section-3.2

<!-- This file is automatically generated. Please don't edit it directly. If you find an error, edit the source file of the module in question (likely index.js or index.ts), and re-run "yarn docs" from the root of the turf project. -->

---

This module is part of the [Turfjs project](https://turfjs.org/), an open source module collection dedicated to geographic algorithms. It is maintained in the [Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create PRs and issues.

### Installation

Install this single module individually:

```sh
$ npm install @turf/rhumb-destination
```

Or install the all-encompassing @turf/turf module that includes all modules as functions:

```sh
$ npm install @turf/turf
```
