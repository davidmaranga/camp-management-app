import { point, polygon, booleanPointInPolygon } from '@turf/turf';
import { buildingsCoordinates } from '../screens/Map/MapSidebar/constants';

export const randomPointInPoly = (polyGeoJson, poly) => {
  const bounds = poly.getBounds();

  const x_min = bounds.getEast();
  const x_max = bounds.getWest();
  const y_min = bounds.getSouth();
  const y_max = bounds.getNorth();

  const lat = y_min + Math.random() * (y_max - y_min);
  const lng = x_min + Math.random() * (x_max - x_min);

  const pt = point([lng, lat]);
  const inside = booleanPointInPolygon(pt, polyGeoJson);

  if (inside) {
    return pt;
  }

  return randomPointInPoly(polyGeoJson, poly);
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
