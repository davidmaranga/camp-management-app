import React, { useRef, useContext, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useAlert } from 'react-alert';
import useSound from 'use-sound';
import AlertSoundEffect from '../../static/mp3/alert-sound-effect.mp3';
import styles from './styles.module.scss';

import { ControlledSelect, Text } from '../../components/elements';
import { MapContext } from '../../contexts';
import { textTypes } from '../../globals';
import { checkIsInBounds, checkIsInBuilding, movePin } from '../../utils/map';
import { mapViews, outerWrapperGeoJson } from './constants';
import PinPopup from './PinPopup';
import MapTabs from './MapTabs';

// Legend
import Personnel from '../../static/images/personnel.svg';
import Vehicle from '../../static/images/vehicle.svg';
import Visitor from '../../static/images/visitor.svg';
import AlertPersonnel from '../../static/images/alert-personnel.svg';
import AlertVehicle from '../../static/images/alert-vehicle.svg';
import AlertVisitor from '../../static/images/alert-visitor.svg';

// Constants
mapboxgl.accessToken =
  'pk.eyJ1Ijoic29uMGZhbnRvbiIsImEiOiJja3Vhb2k2YzQwaXB6Mm9vODl3YjA1ZTEyIn0.8a3KACJ4PHJ_rkkVVwg0yA';
const lat = 14.607836772149098;
const lng = 121.05398662456394;
const zoom = 16;

const Map = () => {
  const alert = useAlert();
  const [playAlert] = useSound(AlertSoundEffect);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const pinPopupRef = useRef(new mapboxgl.Popup({ offset: 15 }));
  const {
    users,
    histories,
    updateHistories,
    userLocations,
    updateUserLocations,
    vehicleLocations,
    updateVehicleLocations,
    alertLocations,
    updateAlertLocations,
  } = useContext(MapContext);
  const [viewType, setViewType] = useState({
    value: mapViews.ALL,
    label: `View ${mapViews.ALL}`,
  });
  const [activeTab, setActiveTab] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const generatePins = (locations) => {
    const pins = [];

    locations.forEach((location) => {
      let icon = '';

      // Format pins
      if (location.type === 'Visitor') {
        icon = 'visitor';
      } else if (location.type === 'Personnel') {
        icon = 'personnel';
      } else if (location.type === 'Vehicle') {
        icon = 'vehicle';
      } else if (location.type === 'Alert-Visitor') {
        icon = 'alert-visitor';
      } else if (location.type === 'Alert-Personnel') {
        icon = 'alert-personnel';
      } else if (location.type === 'Alert-Vehicle') {
        icon = 'alert-vehicle';
      }

      // Get user details
      const user = users.find((u) => u.id === location.userID);
      const userLatestHistory = histories
        .filter((h) => h.userID === user.id)
        .sort((a, b) => (a.date < b.date ? 1 : -1))[0];

      pins.push({
        type: 'Feature',
        properties: {
          location,
          user,
          userLatestHistory,
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

  const setPins = (pins) => {
    map.current.getSource('pins').setData({
      type: 'FeatureCollection',
      features: pins,
    });
  };

  const updateViewType = (selectedViewType) => {
    if (selectedViewType.value === mapViews.ALL) {
      setPins(
        generatePins([...userLocations, ...vehicleLocations, ...alertLocations])
      );
    } else if (selectedViewType.value === mapViews.ALERTS) {
      setPins(generatePins(alertLocations));
    } else if (selectedViewType.value === mapViews.VEHICLES) {
      setPins(generatePins(vehicleLocations));
    } else if (selectedViewType.value === mapViews.PERSONNELS) {
      const personnelLocations = userLocations.filter(
        (userLocation) => userLocation.type === 'Personnel'
      );
      setPins(generatePins(personnelLocations));
    } else if (selectedViewType.value === mapViews.VISITORS) {
      const visitorLocations = userLocations.filter(
        (userLocation) => userLocation.type === 'Visitor'
      );
      setPins(generatePins(visitorLocations));
    }

    setViewType(selectedViewType);
  };

  const updatePinsRandomly = (
    historiesToUpdate,
    uLocations,
    vLocations,
    aLocations
  ) => {
    uLocations.forEach((userLocation) => {
      let newCoords = movePin(
        userLocation.longitude,
        userLocation.latitude,
        outerWrapperGeoJson
      );

      while (
        !checkIsInBounds(
          newCoords.newLng,
          newCoords.newLat,
          outerWrapperGeoJson
        )
      ) {
        newCoords = movePin(
          userLocation.longitude,
          userLocation.latitude,
          outerWrapperGeoJson
        );
      }

      userLocation.latitude = newCoords.newLat;
      userLocation.longitude = newCoords.newLng;

      const building = checkIsInBuilding(
        userLocation.longitude,
        userLocation.latitude
      );
      if (building) {
        // We update the officesVisited of the user in their history
        const foundHistory = historiesToUpdate.find(
          (history) => history.userID === userLocation.userID
        );

        // We don't need to add the office if it exists in their history already
        if (!foundHistory.officesVisited.includes(building)) {
          foundHistory.officesVisited = [
            ...foundHistory.officesVisited,
            building,
          ];
        }
      }
    });

    vLocations.forEach((vehicleLocation) => {
      let newCoords = movePin(
        vehicleLocation.longitude,
        vehicleLocation.latitude,
        outerWrapperGeoJson
      );

      while (
        !checkIsInBounds(
          newCoords.newLng,
          newCoords.newLat,
          outerWrapperGeoJson
        )
      ) {
        newCoords = movePin(
          vehicleLocation.longitude,
          vehicleLocation.latitude,
          outerWrapperGeoJson
        );
      }

      vehicleLocation.latitude = newCoords.newLat;
      vehicleLocation.longitude = newCoords.newLng;
    });

    const newPins = generatePins([...uLocations, ...vLocations, ...aLocations]);
    setPins(newPins);
  };

  const simulate = () => {
    setIsSimulating(true);

    const historiesCopy = JSON.parse(localStorage.getItem('histories'));
    let userLocationsCopy = JSON.parse(localStorage.getItem('userLocations'));
    const vehicleLocationsCopy = JSON.parse(
      localStorage.getItem('vehicleLocations')
    );
    const alertLocationsCopy = JSON.parse(
      localStorage.getItem('alertLocations')
    );

    // Set viewType to all
    updateViewType({
      value: mapViews.ALL,
      label: `View ${mapViews.ALL}`,
    });

    // Update each of their latitude and longitude randomly
    let times = 0;
    const simulateId = setInterval(() => {
      updatePinsRandomly(
        historiesCopy,
        userLocationsCopy,
        vehicleLocationsCopy,
        alertLocationsCopy
      );

      // Proceed 5 times only
      if (++times === 5) {
        // We need to get two userLocations (visitor, and personnel) for lost pin simulation
        const alertVisitorLocation = userLocationsCopy.find(
          (userLocation) => userLocation.type === 'Visitor'
        );
        if (alertVisitorLocation) {
          alertVisitorLocation.type = 'Alert-Visitor';
          alertVisitorLocation.lastSeen = Math.floor(Date.now() / 1000);
          alertLocationsCopy.push(alertVisitorLocation);

          // Remove the visitorLocation we copied
          userLocationsCopy = userLocationsCopy.filter(
            (userLocation) => userLocation.id !== alertVisitorLocation.id
          );
        }

        const alertPersonnelLocation = userLocationsCopy.find(
          (userLocation) => userLocation.type === 'Personnel'
        );
        if (alertPersonnelLocation) {
          alertPersonnelLocation.type = 'Alert-Personnel';
          alertPersonnelLocation.lastSeen = Math.floor(Date.now() / 1000);
          alertLocationsCopy.push(alertPersonnelLocation);

          // Remove the personnelLocation we copied
          userLocationsCopy = userLocationsCopy.filter(
            (userLocation) => userLocation.id !== alertPersonnelLocation.id
          );
        }

        // We also need to get one vehicleLocation for lost pin simulation
        const alertVehicleLocation = vehicleLocationsCopy.shift();
        if (alertVehicleLocation) {
          alertVehicleLocation.type = 'Alert-Vehicle';
          alertVehicleLocation.lastSeen = Math.floor(Date.now() / 1000);
          alertLocationsCopy.push(alertVehicleLocation);
        }

        // Then we generatePins one last time with alertLocations included
        const newPins = generatePins([
          ...userLocationsCopy,
          ...vehicleLocationsCopy,
          ...alertLocationsCopy,
        ]);

        setPins(newPins);

        // Then, we update the localstorage and states
        updateHistories(historiesCopy);
        updateUserLocations(userLocationsCopy);
        updateVehicleLocations(vehicleLocationsCopy);
        updateAlertLocations(alertLocationsCopy);

        // Lastly, we show an alert message if there are alertLocations
        if (alertLocationsCopy.length) {
          playAlert(); // Play an alert sound effect as well
          alert.error('Some pins disappeared!');
        }

        // End simulation
        setIsSimulating(false);
        clearInterval(simulateId);
      }
    }, 1000);
  };

  const flyToLocation = (userID) => {
    const locations = [...userLocations, ...alertLocations];
    const foundLocation = locations.find((l) => l.userID === userID);

    // Hide activeTab
    setActiveTab(null);

    // Click pin
    map.current.fire('click', {
      lngLat: { lat: foundLocation.latitude, lng: foundLocation.longitude },
      point: map.current.project([
        foundLocation.longitude,
        foundLocation.latitude,
      ]),
      originalEvent: {},
    });
  };

  const resolveAlert = (alertLocationId) => {
    const alertLocationsCopy = JSON.parse(
      localStorage.getItem('alertLocations')
    );
    const userLocationsCopy = JSON.parse(localStorage.getItem('userLocations'));
    const vehicleLocationsCopy = JSON.parse(
      localStorage.getItem('vehicleLocations')
    );

    const foundAlertLocation = alertLocationsCopy.find(
      (alertLocation) => alertLocation.id === alertLocationId
    );

    // 1.) Update properties
    foundAlertLocation.type = foundAlertLocation.type.substring(6);
    delete foundAlertLocation.lastSeen;

    // 2.) Add this updated alertLocation in userLocation to simulate
    // return of user
    updateUserLocations([...userLocationsCopy, foundAlertLocation]);

    // 3.) We remove that alertLocation in alertLocations
    const filteredAlertLocations = alertLocationsCopy.filter(
      (alertLocation) => alertLocation.id !== alertLocationId
    );
    updateAlertLocations(filteredAlertLocations);

    // 4.) Re set pins
    const newPins = generatePins([
      ...userLocationsCopy,
      foundAlertLocation,
      ...vehicleLocationsCopy,
      ...filteredAlertLocations,
    ]);
    setPins(newPins);

    // 5.) Hide popup
    pinPopupRef.current.remove();
  };

  useEffect(() => {
    if (map.current) return; // Initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/son0fanton/ckui592l7eu9p17qiy1rd6t2j',
      center: [lng, lat],
      zoom,
      antialias: true,
      interactive: true,
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
      const pins = generatePins([
        ...userLocations,
        ...vehicleLocations,
        ...alertLocations,
      ]);

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
          'icon-size': ['interpolate', ['linear'], ['zoom'], 10, 0.9, 16, 0.4], // 0.4
          'icon-allow-overlap': true,
        },
      });

      map.current.on('click', 'pins', (e) => {
        // Copy coordinates array.
        const coordinates = e.features[0].geometry.coordinates.slice();
        const { location, user, userLatestHistory } = e.features[0].properties;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        const pinPopupNode = document.createElement('div');
        ReactDOM.render(
          <PinPopup
            location={JSON.parse(location)}
            user={JSON.parse(user)}
            userLatestHistory={JSON.parse(userLatestHistory)}
            resolveAlert={resolveAlert}
          />,
          pinPopupNode
        );

        pinPopupRef.current
          .setLngLat(coordinates)
          .setDOMContent(pinPopupNode)
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
      <MapTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        simulate={simulate}
        isSimulating={isSimulating}
        generatePins={generatePins}
        setPins={setPins}
        flyToLocation={flyToLocation}
      />

      <div ref={mapContainer} className={styles.Map_container} />

      <div className={styles.MapFilter}>
        <ControlledSelect
          options={[
            {
              label: `View ${mapViews.ALL}`,
              value: mapViews.ALL,
            },
            {
              label: `View ${mapViews.ALERTS}`,
              value: mapViews.ALERTS,
            },
            {
              label: `View ${mapViews.VEHICLES}`,
              value: mapViews.VEHICLES,
            },
            {
              label: `View ${mapViews.PERSONNELS}`,
              value: mapViews.PERSONNELS,
            },
            {
              label: `View ${mapViews.VISITORS}`,
              value: mapViews.VISITORS,
            },
          ]}
          name="viewType"
          label="View Type"
          value={viewType}
          onChange={(val) => updateViewType(val)}
        />
      </div>

      {!activeTab && (
        <div className={styles.MapLegend}>
          <Text type={textTypes.HEADING.XXS}>Legend</Text>

          <ul className={styles.MapLegend_lists}>
            <li className={styles.MapLegend_lists_list}>
              <img
                src={Personnel}
                alt="Personnel Icon"
                className={styles.MapLegend_lists_list_icon}
              />

              <Text>Personnel</Text>
            </li>

            <li className={styles.MapLegend_lists_list}>
              <img
                src={Vehicle}
                alt="Vehicle Icon"
                className={styles.MapLegend_lists_list_icon}
              />

              <Text>Vehicle</Text>
            </li>

            <li className={styles.MapLegend_lists_list}>
              <img
                src={Visitor}
                alt="Visitor Icon"
                className={styles.MapLegend_lists_list_icon}
              />

              <Text>Visitor</Text>
            </li>

            <li className={styles.MapLegend_lists_list}>
              <img
                src={AlertPersonnel}
                alt="Alert Personnel Icon"
                className={styles.MapLegend_lists_list_icon}
              />

              <Text>Alert Personnel</Text>
            </li>

            <li className={styles.MapLegend_lists_list}>
              <img
                src={AlertVehicle}
                alt="Alert Vehicle Icon"
                className={styles.MapLegend_lists_list_icon}
              />

              <Text>Alert Vehicle</Text>
            </li>

            <li className={styles.MapLegend_lists_list}>
              <img
                src={AlertVisitor}
                alt="Alert Visitor Icon"
                className={styles.MapLegend_lists_list_icon}
              />

              <Text>Alert Visitor</Text>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Map;
