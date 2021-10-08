import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { dataLocation } from '../../utils/sprite';
import './index.scss';

mapboxgl.accessToken =
  'pk.eyJ1Ijoic29uMGZhbnRvbiIsImEiOiJja3Vhb2k2YzQwaXB6Mm9vODl3YjA1ZTEyIn0.8a3KACJ4PHJ_rkkVVwg0yA';

const Map3D = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(121.053523);
  const [lat, setLat] = useState(14.607653);
  const [zoom, setZoom] = useState(16.0);
  const bounds = [
    [121.04665882953464, 14.603769139644442],
    [121.0613144195919, 14.610704349961054],
  ];

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      // style: 'mapbox://styles/son0fanton/ckucmdm5j0t4g18rzvcqe0phs',
      style: 'mapbox://styles/son0fanton/ckugwm27x5xjs18rxg9gv3fnb',
      center: [lng, lat],
      pitch: 49.62,
      bearing: -145.33,
      zoom,
      maxBounds: bounds, // create boundaries
      antialias: true,
    });

    // console.log(map.current.getBounds());

    map.current.on('load', () => {
      const { layers } = map.current.getStyle();
      const labelLayerId = layers.find(
        (layer) => layer.type === 'symbol' && layer.layout['text-field']
      ).id;

      // map.current.addLayer(
      //   {
      //     id: 'add-3d-buildings',
      //     source: 'composite',
      //     'source-layer': 'building',
      //     filter: ['==', 'extrude', 'true'],
      //     type: 'fill-extrusion',
      //     minzoom: 15,
      //     paint: {
      //       'fill-extrusion-color': '#aaa',

      //       // Use an 'interpolate' expression to
      //       // add a smooth transition effect to
      //       // the buildings as the user zooms in.
      //       'fill-extrusion-height': [
      //         'interpolate',
      //         ['linear'],
      //         ['zoom'],
      //         15,
      //         0,
      //         15.05,
      //         ['get', 'height'],
      //       ],
      //       'fill-extrusion-base': [
      //         'interpolate',
      //         ['linear'],
      //         ['zoom'],
      //         15,
      //         0,
      //         15.05,
      //         ['get', 'min_height'],
      //       ],
      //       'fill-extrusion-opacity': 0.6,
      //     },
      //   },
      //   labelLayerId
      // );

      map.current.addSource('mainWrapperSource', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            // These coordinates outline Maine.
            coordinates: [
              [
                [121.05020916725448, 14.609554652165913], // NW
                [121.05192327832602, 14.604771371932427], // Sw
                [121.0567453066866, 14.606562170136694], // SE
                [121.05484620329813, 14.610741014344544], // NE
                [121.05020916725448, 14.609554652165913], // NW
              ],
            ],
          },
        },
      });

      map.current.addSource('userPin', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [121.05551152122844, 14.609190169474882],
          },
        },
      });

      let lati = 14.609190169474882;
      let longi = 121.05551152122844;

      map.current.addLayer({
        id: 'userPin',
        type: 'symbol',
        source: 'userPin',
        layout: {
          'icon-image': 'in-national-2',
        },
      });

      setInterval(async () => {
        lati -= 0.00000000920322;
        longi -= 0.0000025001024;
        const geojson = await dataLocation(map, lati, longi);
        map.current.getSource('userPin').setData(geojson);
      }, 100);

      map.current.addLayer({
        id: 'mainWrapper',
        type: 'fill',
        source: 'mainWrapperSource', // reference the data source
        layout: {},
        paint: {
          'fill-color': '#ffffff', // blue color fill
          'fill-opacity': 0,
        },
      });
      // Add a black outline around the polygon.
      map.current.addLayer({
        id: 'mainWrapperOutline',
        type: 'line',
        source: 'mainWrapperSource',
        layout: {},
        paint: {
          'line-color': 'blue',
          'line-width': 3,
        },
      });
    });
  });

  return (
    <div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
};

export default Map3D;
