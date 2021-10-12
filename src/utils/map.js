import { point, polygon, booleanPointInPolygon } from '@turf/turf';
import { buildingsCoordinates } from '../screens/Map/MapTabs/constants';

// Checks if a specifc point is inside bounds of a polygon
export const checkIsInBounds = (lng, lat, polyGeoJson) => {
  const pt = point([lng, lat]);
  const inside = booleanPointInPolygon(pt, polyGeoJson);

  return inside;
};

// Creates a random point inside a polygon
export const randomPointInPoly = (polyGeoJson) => {
  // This is just the coordinates of the outer wrapper
  // of Camp Crame
  const x_min = 121.06171138652763;
  const x_max = 121.04626186260231;
  const y_min = 14.604151123076718;
  const y_max = 14.61152235943267;

  const lat = y_min + Math.random() * (y_max - y_min);
  const lng = x_min + Math.random() * (x_max - x_min);

  const pt = point([lng, lat]);
  const inside = booleanPointInPolygon(pt, polyGeoJson);

  if (inside) {
    return pt;
  }

  return randomPointInPoly(polyGeoJson);
};

export const checkIsInBuilding = (lng, lat) => {
  const pt = point([lng, lat]);
  for (let i = 0; i < buildingsCoordinates.length; i++) {
    const poly = polygon(buildingsCoordinates[i].coordinates);
    const inside = booleanPointInPolygon(pt, poly);
    if (inside) {
      return buildingsCoordinates[i].name;
    }
  }

  return null;
};

export const movePin = (currentLng, currentLat) => {
  const r = 10 / 111300; // = 10 meters
  const y0 = currentLat;
  const x0 = currentLng;
  const u = Math.random();
  const v = Math.random();
  const w = r * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const x = w * Math.cos(t);
  const y1 = w * Math.sin(t);
  const x1 = x / Math.cos(y0);

  const newLat = y0 + y1;
  const newLng = x0 + x1;

  return { newLat, newLng };
};
