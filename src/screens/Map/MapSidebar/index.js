import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

import { DataTable } from '../../../components';
import { Button, IconButton, Tabs, Text } from '../../../components/elements';
import { tabTypes, textTypes } from '../../../globals';
import { MapContext } from '../../../contexts';
import { mapTabs } from './constants';
import { usersColumns, historyColumns } from './constants/dataTableColumns';
import {
  convertTimestampToDate,
  convertTimestampToTimeWithSuffix,
} from '../../../utils/datetime';

const MapSidebar = ({ simulate, isSimulating }) => {
  const { users, histories } = useContext(MapContext);
  const [activeTab, setActiveTab] = useState(null);

  // Format Users Data
  const usersData = [];
  users.forEach((user) => {
    const userLatestHistory = histories
      .filter((h) => h.userID === user.id)
      .sort((a, b) => (a.date < b.date ? 1 : -1))[0];

    usersData.push({
      ...user,
      dateRegistered: convertTimestampToDate(user.dateRegistered),
      status:
        userLatestHistory?.timeIn && !userLatestHistory?.timeOut
          ? 'Active'
          : 'Inactive',
    });
  });

  // Format Histories Data
  const historiesData = [];
  histories.forEach((history) => {
    // Push updated history
    historiesData.push({
      ...history,
      date: convertTimestampToDate(history?.date),
      timeIn: convertTimestampToTimeWithSuffix(history?.timeIn),
      timeOut: history?.timeOut
        ? convertTimestampToTimeWithSuffix(history?.timeOut)
        : '-',
      intendedOfficesToVisit: history?.intendedOfficesToVisit,
      officesVisited: history?.officesVisited ? history?.officesVisited : '-',
      userGpsDevice: history?.userGpsDevice ? history?.userGpsDevice : '-',
      vehicleGpsDevice: history?.vehicleGpsDevice
        ? history?.vehicleGpsDevice
        : '-',
      plateNumber: history?.plateNumber ? history?.plateNumber : '-',
      color: history?.color ? history?.color : '-',
      brand: history?.brand ? history?.brand : '-',
      model: history?.model ? history?.model : '-',
    });
  });

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
              icon: mapTabs.CAMP_DATA.icon,
              name: mapTabs.CAMP_DATA.name,
              value: mapTabs.CAMP_DATA.value,
              action: () => {
                setActiveTab(mapTabs.CAMP_DATA.value);
              },
            },
          ]}
          activeTab={activeTab}
        />

        <Button
          icon="view_in_ar"
          className={styles.MapSidebar_simulateButton}
          onClick={simulate}
          disabled={isSimulating}
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
            {activeTab === mapTabs.CAMP_DATA.value && (
              <>
                <Text
                  type={textTypes.HEADING.XXS}
                  className={styles.MapSidebar_contents_title}
                >
                  Camp Data
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
          </div>
        )}
      </>
    </>
  );
};

MapSidebar.defaultProps = {
  isSimulating: false,
};

MapSidebar.propTypes = {
  simulate: PropTypes.func.isRequired,
  isSimulating: PropTypes.bool,
};

export default MapSidebar;
