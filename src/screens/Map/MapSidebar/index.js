import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

import { DataTable } from '../../../components';
import { Button, IconButton, Tabs, Text } from '../../../components/elements';
import { tabTypes, textTypes } from '../../../globals';
import { mapTabs } from './constants';
import {
  convertTimestampToDate,
  convertTimestampToTimeWithSuffix,
} from '../../../utils/datetime';

const users = JSON.parse(localStorage.getItem('users')) || [];
const histories = JSON.parse(localStorage.getItem('histories')) || [];
const vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
const gpsDevices = JSON.parse(localStorage.getItem('gpsDevices')) || [];

const usersColumns = [
  {
    name: 'First Name',
    selector: (row) => row.firstName,
    sortable: true,
  },
  {
    name: 'Last Name',
    selector: (row) => row.lastName,
    sortable: true,
  },
  {
    name: 'Sex',
    selector: (row) => row.sex,
    sortable: true,
  },
  {
    name: 'Birth Date',
    selector: (row) => row.birthDate,
  },
  {
    name: 'Home Address',
    selector: (row) => row.homeAddress,
  },
  {
    name: 'Contact Number',
    selector: (row) => row.contactNumber,
  },
  {
    name: 'User Type',
    selector: (row) => row.userType,
    sortable: true,
  },
  {
    name: 'Date Registered',
    selector: (row) => row.dateRegistered,
    sortable: true,
  },
  {
    name: 'isActive',
    selector: (row) => row.isActive,
    sortable: true,
  },
];

const vehiclesColumns = [
  {
    name: 'Owner First Name',
    selector: (row) => row.ownerFirstName,
    sortable: true,
  },
  {
    name: 'Owner Last Name',
    selector: (row) => row.ownerLastName,
    sortable: true,
  },
  {
    name: 'Plate Number',
    selector: (row) => row.plateNumber,
  },
  {
    name: 'Color',
    selector: (row) => row.color,
  },
  {
    name: 'Brand',
    selector: (row) => row.brand,
  },
  {
    name: 'Model',
    selector: (row) => row.model,
  },
];

const historyColumns = [
  {
    name: 'Date',
    selector: (row) => row.date,
    sortable: true,
  },
  {
    name: 'Time In',
    selector: (row) => row.timeIn,
    sortable: true,
  },
  {
    name: 'Time Out',
    selector: (row) => row.timeOut,
    sortable: true,
  },
  {
    name: 'Plate Number',
    selector: (row) => row.plateNumber,
  },
];

const gpsDevicesColumns = [
  {
    name: 'ID',
    selector: (row) => row.id,
    sortable: true,
  },
  {
    name: 'First Name',
    selector: (row) => row.firstName,
    sortable: true,
  },
  {
    name: 'Last Name',
    selector: (row) => row.lastName,
    sortable: true,
  },
  {
    name: 'Plate Number',
    selector: (row) => row.plateNumber,
    sortable: true,
  },
];

const usersData = [];
users.forEach((user) => {
  const userLatestHistory = histories
    .filter((h) => h.userID === user.id)
    .sort((a, b) => (a.date < b.date ? 1 : -1))[0];

  usersData.push({
    ...user,
    dateRegistered: convertTimestampToDate(user.dateRegistered),
    isActive:
      userLatestHistory.timeIn && !userLatestHistory.timeOut ? 'Yes' : 'No',
  });
});

const historiesData = [];
histories.forEach((history) => {
  const vehicle = vehicles.find((v) => v.id === history.vehicleID);

  // Delete unneeded properties
  delete history.vehicleID;

  // Push updated history
  historiesData.push({
    ...history,
    date: convertTimestampToDate(history.date),
    timeIn: convertTimestampToTimeWithSuffix(history.timeIn),
    timeOut: convertTimestampToTimeWithSuffix(history.timeOut),
    plateNumber: vehicle?.plateNumber ? vehicle.plateNumber : 'N/A',
  });
});

const vehiclesData = [];
vehicles.forEach(({ userID, plateNumber, color, brand, model }) => {
  const user = users.find((u) => u.id === userID);

  vehiclesData.push({
    ownerFirstName: user.firstName,
    ownerLastName: user.lastName,
    plateNumber,
    color,
    brand,
    model,
  });
});

const gpsDevicesData = [];
gpsDevices.forEach((gpsDevice) => {
  let data = {};
  if (gpsDevice.type === 'User') {
    const user = users.find((u) => u.id === gpsDevice.assignedID);
    data = {
      firstName: user.firstName,
      lastName: user.lastName,
      plateNumber: 'N/A',
    };
  } else if (gpsDevice.type === 'Vehicle') {
    const vehicle = vehicles.find((v) => v.id === gpsDevice.assignedID);
    data = {
      firstName: 'N/A',
      lastName: 'N/A',
      plateNumber: vehicle.plateNumber,
    };
  } else {
    data = {
      firstName: 'Not Assigned',
      lastName: 'Not Assigned',
      plateNumber: 'Not Assigned',
    };
  }

  gpsDevicesData.push({
    id: gpsDevice.id,
    ...data,
  });
});

const MapSidebar = ({ simulate }) => {
  const [activeTab, setActiveTab] = useState(null);

  return (
    <>
      <div className={styles.MapSidebar}>
        <Tabs
          className={styles.MapSidebar_tabs}
          type={tabTypes.VERTICAL.LG}
          tabs={[
            {
              icon: mapTabs.DASHBOARD.icon,
              name: mapTabs.DASHBOARD.name,
              value: mapTabs.DASHBOARD.value,
              action: () => {
                setActiveTab(mapTabs.DASHBOARD.value);
              },
            },
            {
              icon: mapTabs.USERS.icon,
              name: mapTabs.USERS.name,
              value: mapTabs.USERS.value,
              action: () => {
                setActiveTab(mapTabs.USERS.value);
              },
            },
            {
              icon: mapTabs.VEHICLES.icon,
              name: mapTabs.VEHICLES.name,
              value: mapTabs.VEHICLES.value,
              action: () => {
                setActiveTab(mapTabs.VEHICLES.value);
              },
            },
            {
              icon: mapTabs.GPS_DEVICES.icon,
              name: mapTabs.GPS_DEVICES.name,
              value: mapTabs.GPS_DEVICES.value,
              action: () => {
                setActiveTab(mapTabs.GPS_DEVICES.value);
              },
            },
          ]}
          activeTab={activeTab}
        />

        <Button
          icon="view_in_ar"
          className={styles.MapSidebar_simulateButton}
          onClick={simulate}
        >
          Simulate
        </Button>
      </div>

      <>
        {activeTab !== null && (
          <div className={styles.MapSidebar_contents}>
            <IconButton
              icon="close"
              iconClassName={styles.MapSidebar_contents_closeButton_icon}
              className={styles.MapSidebar_contents_closeButton}
              onClick={() => setActiveTab(null)}
            />

            {activeTab === mapTabs.DASHBOARD.value && <p>Dashboard</p>}
            {activeTab === mapTabs.USERS.value && (
              <>
                <Text
                  type={textTypes.HEADING.XXS}
                  className={styles.MapSidebar_contents_title}
                >
                  All Users
                </Text>
                <DataTable
                  columns={usersColumns}
                  data={usersData}
                  expandableRowsComponent={(row) => (
                    <DataTable
                      columns={historyColumns}
                      data={historiesData.filter(
                        (h) => h.userID === row.data.id
                      )}
                      filter={false}
                    />
                  )}
                />
              </>
            )}

            {activeTab === mapTabs.VEHICLES.value && (
              <>
                <Text
                  type={textTypes.HEADING.XXS}
                  className={styles.MapSidebar_contents_title}
                >
                  All Vehicles
                </Text>
                <DataTable columns={vehiclesColumns} data={vehiclesData} />
              </>
            )}

            {activeTab === mapTabs.GPS_DEVICES.value && (
              <>
                <Text
                  type={textTypes.HEADING.XXS}
                  className={styles.MapSidebar_contents_title}
                >
                  All GPS Devices
                </Text>
                <DataTable columns={gpsDevicesColumns} data={gpsDevicesData} />
              </>
            )}
          </div>
        )}
      </>
    </>
  );
};

MapSidebar.propTypes = {
  simulate: PropTypes.func.isRequired,
};

export default MapSidebar;
