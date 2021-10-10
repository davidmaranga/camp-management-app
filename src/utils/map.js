import { point, polygon, booleanPointInPolygon } from '@turf/turf';
import { buildingsCoordinates } from '../screens/Map/MapSidebar/constants';

export const checkIsInBounds = (lng, lat, polyGeoJson) => {
  const pt = point([lng, lat]);
  const inside = booleanPointInPolygon(pt, polyGeoJson);

  return inside;
};

export const randomPointInPoly = (polyGeoJson) => {
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

export const movePin = (currentLat, currentLng) => {
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

  return { newLat: y0 + y1, newLng: x0 + x1 };
};
