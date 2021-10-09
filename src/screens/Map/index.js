import React, { useRef, useContext, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import styles from './styles.module.scss';

import { MapContext } from '../../contexts';
import { checkIsInBounds, checkIsInBuilding, movePin } from '../../utils/map';
import outerWrapperGeoJson from './constants/outerWrapperGeoJson';
import MapSidebar from './MapSidebar';

// Constants
mapboxgl.accessToken =
  'pk.eyJ1Ijoic29uMGZhbnRvbiIsImEiOiJja3Vhb2k2YzQwaXB6Mm9vODl3YjA1ZTEyIn0.8a3KACJ4PHJ_rkkVVwg0yA';
const lat = 14.607836772149098;
const lng = 121.05398662456394;
const zoom = 16;

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const {
    users,
    histories,
    updateHistories,
    userLocations,
    updateUserLocations,
    vehicleLocations,
    updateVehicleLocations,
  } = useContext(MapContext);
  const [isSimulating, setIsSimulating] = useState(false);

  const generatePins = (locations) => {
    const pins = [];

    locations.forEach((location) => {
      const user = users.find((u) => u.id === location.userID);
      let icon = '';
      let description = '';

      if (location.type === 'Vehicle') {
        // Format for a vehicle pin
        const userLatestHistory = histories
          .filter((h) => h.userID === user.id)
          .sort((a, b) => (a.date < b.date ? 1 : -1))[0];

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
            ${userLatestHistory.plateNumber}
          </p>
          <p>
            <strong>Color:</strong>
            ${userLatestHistory.color}
          </p>
          <p>
            <strong>Brand:</strong>
            ${userLatestHistory.brand}
          </p>
          <p>
            <strong>Model:</strong>
            ${userLatestHistory.model}
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
        // Format for a user pin
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

  const simulate = () => {
    setIsSimulating(true);

    let userLocationsCopy = JSON.parse(JSON.stringify(userLocations));
    let vehicleLocationsCopy = JSON.parse(JSON.stringify(vehicleLocations));

    // Update each of their latitude and longitude randomly
    let times = 0;
    const simulateId = setInterval(() => {
      const finalUserLocations = [];
      const finalVehicleLocations = [];

      userLocationsCopy.forEach((userLocation) => {
        const newCoords = movePin(
          userLocation.latitude,
          userLocation.longitude
        );

        userLocation.latitude = newCoords.newLat;
        userLocation.longitude = newCoords.newLng;

        if (
          checkIsInBounds(
            userLocation.longitude,
            userLocation.latitude,
            outerWrapperGeoJson
          )
        ) {
          finalUserLocations.push(userLocation);
        } else {
          // Update latest history of user
          const historiesCopy = JSON.parse(JSON.stringify(histories));
          const retrievedHistory = historiesCopy.find(
            (h) => h.userID === userLocation.userID
          );
          retrievedHistory.timeOut = Math.floor(Date.now() / 1000);
          updateHistories(historiesCopy);
        }
      });

      vehicleLocationsCopy.forEach((vehicleLocation) => {
        const newCoords = movePin(
          vehicleLocation.latitude,
          vehicleLocation.longitude
        );

        vehicleLocation.latitude = newCoords.newLat;
        vehicleLocation.longitude = newCoords.newLng;

        if (
          checkIsInBounds(
            vehicleLocation.longitude,
            vehicleLocation.latitude,
            outerWrapperGeoJson
          )
        ) {
          finalVehicleLocations.push(vehicleLocation);
        }
      });

      const newPins = generatePins([
        ...finalUserLocations,
        ...finalVehicleLocations,
      ]);

      map.current.getSource('pins').setData({
        type: 'FeatureCollection',
        features: newPins,
      });

      userLocationsCopy = JSON.parse(JSON.stringify(finalUserLocations));
      vehicleLocationsCopy = JSON.parse(JSON.stringify(finalVehicleLocations));

      // Proceed 5 times only
      if (++times === 5) {
        updateUserLocations(finalUserLocations);
        updateVehicleLocations(finalVehicleLocations);

        setIsSimulating(false);
        clearInterval(simulateId);
      }
    }, 1000);
  };

  useEffect(() => {
    if (map.current) return; // Initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/son0fanton/ckui592l7eu9p17qiy1rd6t2j',
      center: [lng, lat],
      zoom,
      antialias: true,
      interactive: false,
    });

    map.current.on('load', () => {
      // Outer Box
      map.current.addSource('outerWrapperSource', {
        type: 'geojson',
        data: outerWrapperGeoJson,
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

      // Generate Pins
      const pins = generatePins([...userLocations, ...vehicleLocations]);

      map.current.addSource('pins', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: pins,
        },
      });

      // Add a layer showing the pins.
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
      <MapSidebar simulate={simulate} isSimulating={isSimulating} />

      <div ref={mapContainer} className={styles.Map_container} />
    </div>
  );
};

export default Map;
