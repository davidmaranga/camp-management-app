import React, { useState } from 'react';
import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';
import { Provider as AlertProvider } from 'react-alert';
import { Registration, Map, Map3d, Tracker } from './screens';
import { Alert } from './components/elements';
import { MapContext } from './contexts';
import {
  usersData,
  gpsDevicesData,
  historiesData,
  userLocationsData,
  vehicleLocationsData,
  alertLocationsData,
} from './data';
import './scss/App.scss';

// Alert configuration
const alertOptions = {
  position: 'bottom right',
  timeout: 3000,
  offset: '0 20px 10px',
  transition: 'scale',
};

if (!JSON.parse(localStorage.getItem('users'))) {
  // Set static dummy data of users
  localStorage.setItem('users', JSON.stringify(usersData));
}

if (!JSON.parse(localStorage.getItem('gpsDevices'))) {
  // Set static dummy data of gpsDevices
  localStorage.setItem('gpsDevices', JSON.stringify(gpsDevicesData));
}

if (!JSON.parse(localStorage.getItem('histories'))) {
  // Set static dummy data of histories
  localStorage.setItem('histories', JSON.stringify(historiesData));
}

if (!JSON.parse(localStorage.getItem('userLocations'))) {
  // Set static dummy data of userLocations
  localStorage.setItem('userLocations', JSON.stringify(userLocationsData));
}

if (!JSON.parse(localStorage.getItem('vehicleLocations'))) {
  // Set static dummy data of vehicleLocations
  localStorage.setItem(
    'vehicleLocations',
    JSON.stringify(vehicleLocationsData)
  );
}

if (!JSON.parse(localStorage.getItem('alertLocations'))) {
  // Set static dummy data of alertLocations
  localStorage.setItem('alertLocations', JSON.stringify(alertLocationsData));
}

/* eslint-disable react/jsx-props-no-spreading */
const App = () => {
  const [users, setUsers] = useState(
    JSON.parse(localStorage.getItem('users')) || []
  );
  const [gpsDevices, setGpsDevices] = useState(
    JSON.parse(localStorage.getItem('gpsDevices') || [])
  );
  const [histories, setHistories] = useState(
    JSON.parse(localStorage.getItem('histories') || [])
  );
  const [userLocations, setUserLocations] = useState(
    JSON.parse(localStorage.getItem('userLocations') || [])
  );
  const [vehicleLocations, setVehicleLocations] = useState(
    JSON.parse(localStorage.getItem('vehicleLocations') || [])
  );
  const [alertLocations, setAlertLocations] = useState(
    JSON.parse(localStorage.getItem('alertLocations') || [])
  );

  const updateUsers = (newUsers) => {
    setUsers(newUsers);
    localStorage.setItem('users', JSON.stringify(newUsers));
  };

  const updateGpsDevices = (newGpsDevices) => {
    setGpsDevices(newGpsDevices);
    localStorage.setItem('gpsDevices', JSON.stringify(newGpsDevices));
  };

  const updateHistories = (newHistories) => {
    setHistories(newHistories);
    localStorage.setItem('histories', JSON.stringify(newHistories));
  };

  const updateUserLocations = (newUserLocations) => {
    setUserLocations(newUserLocations);
    localStorage.setItem('userLocations', JSON.stringify(newUserLocations));
  };

  const updateVehicleLocations = (newVehicleLocations) => {
    setVehicleLocations(newVehicleLocations);
    localStorage.setItem(
      'vehicleLocations',
      JSON.stringify(newVehicleLocations)
    );
  };

  const updateAlertLocations = (newAlertLocations) => {
    setAlertLocations(newAlertLocations);
    localStorage.setItem('alertLocations', JSON.stringify(newAlertLocations));
  };

  return (
    <BrowserRouter basename="/">
      <React.Suspense fallback={<div>Loading...</div>}>
        <MapContext.Provider
          value={{
            users,
            updateUsers,
            gpsDevices,
            updateGpsDevices,
            histories,
            updateHistories,
            userLocations,
            updateUserLocations,
            vehicleLocations,
            updateVehicleLocations,
            alertLocations,
            updateAlertLocations,
          }}
        >
          <AlertProvider template={Alert} {...alertOptions}>
            <Switch>
              <Route
                path="/registration"
                name="Registration"
                render={(props) => <Registration {...props} />}
              />

              <Route
                path="/map"
                name="Map"
                render={(props) => <Map {...props} />}
              />

              <Route
                path="/map3d"
                name="Map3d"
                render={(props) => <Map3d {...props} />}
              />

              <Route
                path="/tracker"
                name="Tracker"
                render={(props) => <Tracker {...props} />}
              />

              <Redirect to="/page-not-found" />
            </Switch>
          </AlertProvider>
        </MapContext.Provider>
      </React.Suspense>
    </BrowserRouter>
  );
};

export default App;
