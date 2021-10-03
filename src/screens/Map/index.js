import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import styles from './styles.module.scss';

// eslint-disable-next-line import/no-webpack-loader-syntax
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken =
  'pk.eyJ1IjoiZGF2aWRtYXJhbmdhIiwiYSI6ImNrdWF4Zng1aTBsNHMycG1hcmJjdXpmbGkifQ.Xs3iJbfLZG-1Qkzwjv7V2g';

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(123.90358378851431);
  const [lat, setLat] = useState(10.312895030468853);
  const [zoom, setZoom] = useState(18.5);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [lng, lat],
      zoom,
      pitch: 0,
      bearing: 0,
      antialias: true,
      interactive: false,
    });

    map.current.on('load', () => {
      // Insert the layer beneath any symbol layer.
      const { layers } = map.current.getStyle();
      const labelLayerId = layers.find(
        (layer) => layer.type === 'symbol' && layer.layout['text-field']
      ).id;

      // The 'building' layer in the Mapbox Streets
      // vector tileset contains building height data
      // from OpenStreetMap.
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

      // Add a data source containing GeoJSON data.
      map.current.addSource('mainWrapperSource', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            // These coordinates outline Maine.
            coordinates: [
              [
                [123.90292969916344, 10.313031889063256],
                [123.90385231297617, 10.313422640273584],
                [123.90427908353712, 10.312497942530047],
                [123.90368703189188, 10.312296498829369],
                [123.9036253598455, 10.312432412665652],
                [123.90329233079505, 10.312330477293942],
              ],
            ],
          },
        },
      });

      // Add a new layer to visualize the polygon.
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

      // Add a data source containing GeoJSON data.
      map.current.addSource('parkingLotSource', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            // These coordinates outline Maine.
            coordinates: [
              [
                [123.90334107356121, 10.312758983333996],
                [123.90351592499157, 10.31282526885671],
                [123.90356886166312, 10.312692697797338],
                [123.90352234155779, 10.312675337297353],
                [123.90357206994625, 10.312534875034842],
                [123.90345015518749, 10.31249541933186],
                [123.90334107356121, 10.312758983333996],
              ],
            ],
          },
        },
      });

      // Add a new layer to visualize the polygon.
      map.current.addLayer({
        id: 'parkingLot',
        type: 'fill',
        source: 'parkingLotSource', // reference the data source
        layout: {},
        paint: {
          'fill-color': '#ffffff', // blue color fill
          'fill-opacity': 0,
        },
      });

      // Add a black outline around the polygon.
      map.current.addLayer({
        id: 'parkingLotOutline',
        type: 'line',
        source: 'parkingLotSource',
        layout: {},
        paint: {
          'line-color': 'red',
          'line-width': 3,
        },
      });

      // Add a data source containing GeoJSON data.
      map.current.addSource('policeStationSouce', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            // These coordinates outline Maine.
            coordinates: [
              [
                [123.90369529607587, 10.312599531570763],
                [123.90382478872799, 10.312657923590578],
                [123.90390572163554, 10.312443819464988],
                [123.90373666178417, 10.312394274687914],
                [123.90369529607587, 10.312599531570763],
              ],
            ],
          },
        },
      });

      // Add a new layer to visualize the polygon.
      map.current.addLayer({
        id: 'policeStation',
        type: 'fill',
        source: 'policeStationSouce', // reference the data source
        layout: {},
        paint: {
          'fill-color': '#ffffff', // blue color fill
          'fill-opacity': 0,
        },
      });

      // Add a black outline around the polygon.
      map.current.addLayer({
        id: 'policeStationOutline',
        type: 'line',
        source: 'policeStationSouce',
        layout: {},
        paint: {
          'line-color': 'yellow',
          'line-width': 3,
        },
      });
    });
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  return (
    <div className={styles.Map}>
      <div ref={mapContainer} className={styles.Map_container} />
    </div>
  );
};

export default Map;
