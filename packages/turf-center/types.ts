import { lineString } from "@turf/helpers";
import { center } from "./index.js";

const line = lineString([
  [0, 0],
  [10, 10],
]);

center(line);
center(line, { properties: { foo: "bar" } });
