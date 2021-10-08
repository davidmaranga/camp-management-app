import React from 'react';
import { point, booleanPointInPolygon } from '@turf/turf';
import { Wrld, WrldMap } from 'wrld-react';

import styles from './styles.module.scss';

import MapSidebar from './MapSidebar';

const outerWrapper = [
  [40.72330275113281, -73.98849488229412],
  [40.720750834970666, -73.98129815733583],
  [40.72847572321036, -73.97569828569884],
  [40.73139362185151, -73.98255503670494],
  [40.72330275113281, -73.98849488229412],
];

const tompkinsSquarePark = [
  [40.72785793985399, -73.9822432937061],
  [40.72686286333795, -73.97991258958241],
  [40.72507168811388, -73.98122566232816],
  [40.72605020647913, -73.98356730872474],
  [40.72785793985399, -73.9822432937061],
];

const villageViewHousingCorporation = [
  [40.72396047181971, -73.98800987151448],
  [40.72303167981014, -73.98575576330096],
  [40.7254863162693, -73.98392840372978],
  [40.72643165886648, -73.98619345421619],
  [40.72396047181971, -73.98800987151448],
];

const eastSideCommunity = [
  [40.72960364827281, -73.98256414062035],
  [40.72910017825392, -73.9813455638216],
  [40.72845748899251, -73.98181489861956],
  [40.7289788795602, -73.98301894270932],
  [40.72960364827281, -73.98256414062035],
];

const botanicalGarden = [
  [40.72449003578139, -73.98166261736354],
  [40.72349644906108, -73.9792937415675],
  [40.72228536191508, -73.9801715197722],
  [40.72329175981296, -73.98255727591834],
  [40.72449003578139, -73.98166261736354],
];

const randomPointInPoly = (polygon) => {
  const bounds = polygon.getBounds();

  const x_min = bounds.getEast();
  const x_max = bounds.getWest();
  const y_min = bounds.getSouth();
  const y_max = bounds.getNorth();

  const lat = y_min + Math.random() * (y_max - y_min);
  const lng = x_min + Math.random() * (x_max - x_min);

  const pt = point([lng, lat]);
  const poly = polygon.toGeoJSON();
  poly.geometry.type = 'Polygon';
  poly.geometry.coordinates = [poly.geometry.coordinates];
  console.log(poly);
  const ins = booleanPointInPolygon(pt, poly);

  if (ins) {
    return pt;
  }

  return randomPointInPoly(polygon);
};

const Map3d = () => (
  <div className={styles.Map3d}>
    <MapSidebar />

    <WrldMap
      apiKey="f66426e3ccc3c0d0220283b8fb32ded5"
      containerStyle={{
        width: '100vw',
        height: '100vh',
      }}
      mapOptions={{
        center: [40.724881, -73.981529],
        zoom: 20,
      }}
      onInitialStreamingComplete={(map) => {
        const outerWrapperPolyline = Wrld.polyline(outerWrapper, {
          color: 'FF7E00',
        }).addTo(map);

        Wrld.polyline(tompkinsSquarePark, {
          color: '9966CC',
        }).addTo(map);

        Wrld.polyline(villageViewHousingCorporation, {
          color: '00FFFF',
        }).addTo(map);

        Wrld.polyline(eastSideCommunity, {
          color: 'BFFF00',
        }).addTo(map);

        Wrld.polyline(botanicalGarden, {
          color: 'FFBCD9',
        }).addTo(map);

        for (let i = 0; i < 20; i++) {
          Wrld.marker(
            [
              randomPointInPoly(outerWrapperPolyline).geometry.coordinates[1],
              randomPointInPoly(outerWrapperPolyline).geometry.coordinates[0],
            ],
            {
              draggable: true,
            }
          ).addTo(map);
        }
      }}
    />
  </div>
);

export default Map3d;
