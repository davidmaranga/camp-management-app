import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import styles from './styles.module.scss';

import { checkIsInBuilding } from '../../utils/map';
import MapSidebar from './MapSidebar';

mapboxgl.accessToken =
  'pk.eyJ1Ijoic29uMGZhbnRvbiIsImEiOiJja3Vhb2k2YzQwaXB6Mm9vODl3YjA1ZTEyIn0.8a3KACJ4PHJ_rkkVVwg0yA';

const users = JSON.parse(localStorage.getItem('users'));
const vehicles = JSON.parse(localStorage.getItem('vehicles'));

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(121.05398662456394);
  const [lat, setLat] = useState(14.607836772149098);
  const [zoom, setZoom] = useState(16);
  const [userLocations, setUserLocations] = useState(
    JSON.parse(localStorage.getItem('userLocations'))
  );
  const [vehicleLocations, setVehicleLocations] = useState(
    JSON.parse(localStorage.getItem('vehicleLocations'))
  );

  const generatePins = (locations) => {
    const pins = [];

    locations.forEach((location) => {
      const user = users.find((u) => u.id === location.userID);
      let icon = '';
      let description = '';

      if (location.vehicleID) {
        // This means the type of location given is a vehicle
        // and not a user
        const vehicle = vehicles.find((v) => v.id === location.vehicleID);
        icon = 'vehicle';
        description = `
          <p>
            <strong>Owner First Name:</strong>
            ${user.firstName}
          </p>
          <p>
            <strong>Owner Last Name:</strong>
            ${user.lastName}
          </p>
          <p>
            <strong>Plate Number:</strong>
            ${vehicle.plateNumber}
          </p>
          <p>
            <strong>Color:</strong>
            ${vehicle.color}
          </p>
          <p>
            <strong>Brand:</strong>
            ${vehicle.brand}
          </p>
          <p>
            <strong>Model:</strong>
            ${vehicle.model}
          </p>
          <p>  
            <strong>Is in:</strong>
            ${
              checkIsInBuilding(location.longitude, location.latitude) ||
              'Outside'
            }
          </p>
        `;
      } else {
        // This means the type of location given is a user
        icon = user.userType === 'Visitor' ? 'visitor' : 'in-national-2';
        description = `
          <p>  
            <strong>First Name:</strong>
            ${user.firstName}
          </p>
          <p>  
            <strong>Last Name:</strong>
            ${user.lastName}
          </p>
          <p>  
            <strong>Contact Number:</strong>
            ${user.contactNumber}
          </p>
          <p>  
            <strong>Is in:</strong>
            ${
              checkIsInBuilding(location.longitude, location.latitude) ||
              'Outside'
            }
          </p>
        `;
      }

      pins.push({
        type: 'Feature',
        properties: {
          description,
          icon,
        },
        geometry: {
          type: 'Point',
          coordinates: [location.longitude, location.latitude],
        },
      });
    });

    return pins;
  };

  const movePin = (currentLat, currentLng) => {
    const r = 10 / 111300; // = 100 meters
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

  const simulate = () => {
    const userLocationsCopy = JSON.parse(JSON.stringify(userLocations));
    const vehicleLocationsCopy = JSON.parse(JSON.stringify(vehicleLocations));

    // Update each of their latitude and longitude randomly
    let times = 0;
    const simulateId = setInterval(() => {
      userLocationsCopy.forEach((userLocation) => {
        const newCoords = movePin(
          userLocation.latitude,
          userLocation.longitude
        );
        userLocation.latitude = newCoords.newLat;
        userLocation.longitude = newCoords.newLng;
      });

      vehicleLocationsCopy.forEach((vehicleLocation) => {
        const newCoords = movePin(
          vehicleLocation.latitude,
          vehicleLocation.longitude
        );
        vehicleLocation.latitude = newCoords.newLat;
        vehicleLocation.longitude = newCoords.newLng;
      });

      const newPins = generatePins([
        ...userLocationsCopy,
        ...vehicleLocationsCopy,
      ]);

      map.current.getSource('pins').setData({
        type: 'FeatureCollection',
        features: newPins,
      });

      // Proceed 5 times only
      if (++times === 5) {
        setUserLocations(userLocationsCopy);
        setVehicleLocations(vehicleLocationsCopy);

        clearInterval(simulateId);
      }
    }, 1000);
  };

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/son0fanton/ckui592l7eu9p17qiy1rd6t2j',
      center: [lng, lat],
      zoom,
      antialias: true,
      interactive: false,
    });

    map.current.on('load', () => {
      // OUTER BOX
      map.current.addSource('outerWrapperSource', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [121.05020916725448, 14.609554652165913],
                [121.05192327832602, 14.604771371932427],
                [121.0567453066866, 14.606562170136694],
                [121.05484620329813, 14.610741014344544],
                [121.05020916725448, 14.609554652165913],
              ],
            ],
          },
        },
      });
      map.current.addLayer({
        id: 'outerWrapperOutline',
        type: 'line',
        source: 'outerWrapperSource',
        layout: {},
        paint: {
          'line-color': 'blue',
          'line-width': 3,
        },
      });

      // GENERATE PINS
      const pins = generatePins([...userLocations, ...vehicleLocations]);

      map.current.addSource('pins', {
        // This GeoJSON contains features that include an "icon"
        // property. The value of the "icon" property corresponds
        // to an image in the Mapbox Streets style's sprite.
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: pins,
        },
      });

      // Add a layer showing the places.
      map.current.addLayer({
        id: 'pins',
        type: 'symbol',
        source: 'pins',
        layout: {
          'icon-image': '{icon}',
          'icon-size': 0.8,
          'icon-allow-overlap': true,
        },
      });

      // When a click event occurs on a feature in the places layer, open a popup at the
      // location of the feature, with description HTML from its properties.
      map.current.on('click', 'pins', (e) => {
        // Copy coordinates array.
        const coordinates = e.features[0].geometry.coordinates.slice();
        const { description } = e.features[0].properties;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(map.current);
      });

      // Change the cursor to a pointer when the mouse is over the pin layer.
      map.current.on('mouseenter', 'pins', () => {
        map.current.getCanvas().style.cursor = 'pointer';
      });

      // Change it back to a pointer when it leaves.
      map.current.on('mouseleave', 'pins', () => {
        map.current.getCanvas().style.cursor = '';
      });
    });
  });

  return (
    <div className={styles.Map}>
      <MapSidebar simulate={simulate} />

      <div ref={mapContainer} className={styles.Map_container} />
    </div>
  );
};

export default Map;
