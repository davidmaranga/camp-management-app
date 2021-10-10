import { createContext } from 'react';

const MapContext = createContext({
  users: [],
  updateUsers: () => {},
  gpsDevices: [],
  updateGpsDevices: () => {},
  histories: [],
  updateHistories: () => {},
  userLocations: [],
  updateUserLocations: () => {},
  vehicleLocations: [],
  updateVehicleLocations: () => {},
  alertLocations: [],
  updateAlertLocations: () => {},
});

export default MapContext;
