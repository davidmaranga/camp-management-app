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
  warnings: [],
  updateWarnings: () => {},
});

export default MapContext;
