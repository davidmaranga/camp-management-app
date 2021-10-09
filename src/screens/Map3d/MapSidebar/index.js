import React, { useState } from 'react';
import styles from './styles.module.scss';

import { DataTable } from '../../../components';
import { IconButton, Tabs, Text } from '../../../components/elements';
import { tabTypes, textTypes } from '../../../globals';
import { mapTabs } from './constants';
import {
  convertTimestampToDate,
  convertTimestampToTimeWithSuffix,
} from '../../../utils/datetime';

const users = JSON.parse(localStorage.getItem('users')) || [];
const histories = JSON.parse(localStorage.getItem('histories')) || [];

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
    selector: (row) => row?.plateNumber,
  },
];

const usersData = [];
users.forEach((user) => {
  usersData.push({
    ...user,
    dateRegistered: convertTimestampToDate(user.dateRegistered),
  });
});

const historiesData = [];
histories.forEach((history) => {
  const vehicle = histories.find((v) => v.id === history.vehicleID);

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

const MapSidebar = () => {
  const [activeTab, setActiveTab] = useState(null);

  return (
    <div className={styles.MapSidebar}>
      <Tabs
        className={styles.MapSidebar_tabs}
        type={tabTypes.VERTICAL.LG}
        tabs={[
          {
            name: mapTabs.DASHBOARD.name,
            value: mapTabs.DASHBOARD.value,
            action: () => {
              setActiveTab(mapTabs.DASHBOARD.value);
            },
          },
          {
            name: mapTabs.USERS.name,
            value: mapTabs.USERS.value,
            action: () => {
              setActiveTab(mapTabs.USERS.value);
            },
          },
          {
            name: mapTabs.VEHICLES.name,
            value: mapTabs.VEHICLES.value,
            action: () => {
              setActiveTab(mapTabs.VEHICLES.value);
            },
          },
          {
            name: mapTabs.GPS_DEVICES.name,
            value: mapTabs.GPS_DEVICES.value,
            action: () => {
              setActiveTab(mapTabs.GPS_DEVICES.value);
            },
          },
        ]}
        activeTab={activeTab}
      />

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
                    data={historiesData.filter((h) => h.userID === row.data.id)}
                    filter={false}
                  />
                )}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MapSidebar;
