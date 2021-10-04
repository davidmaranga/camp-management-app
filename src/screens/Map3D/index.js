import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import './index.scss';

mapboxgl.accessToken =
  'pk.eyJ1Ijoic29uMGZhbnRvbiIsImEiOiJja3Vhb2k2YzQwaXB6Mm9vODl3YjA1ZTEyIn0.8a3KACJ4PHJ_rkkVVwg0yA';

const Map3D = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(121.05398662456394);
  const [lat, setLat] = useState(14.607236772149098);
  const [zoom, setZoom] = useState(15.4);
  const bounds = [
    [121.04665882953464, 14.603769139644442],
    [121.0613144195919, 14.610704349961054],
  ];

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [lng, lat],
      pitch: 30,
      bearing: 240.6,
      zoom,
      maxBounds: bounds,
      antialias: true,
    });

    // console.log(map.current.getBounds());

    map.current.on('load', () => {
      const { layers } = map.current.getStyle();
      const labelLayerId = layers.find(
        (layer) => layer.type === 'symbol' && layer.layout['text-field']
      ).id;

      map.current.addLayer(
        {
          id: 'add-3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 15,
          paint: {
            'fill-extrusion-color': '#aaa',

            // Use an 'interpolate' expression to
            // add a smooth transition effect to
            // the buildings as the user zooms in.
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'height'],
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'min_height'],
            ],
            'fill-extrusion-opacity': 0.6,
          },
        },
        labelLayerId
      );

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
