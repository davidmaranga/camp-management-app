import React, { useContext, useState } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

import { DataTable } from '../../../components';
import {
  Badge,
  Button,
  Card,
  Grid,
  Icon,
  IconButton,
  Tabs,
  Text,
} from '../../../components/elements';
import { ViewHistoryModal } from '../../../components/modals';
import {
  colorClasses,
  colorNames,
  gridTypes,
  iconButtonTypes,
  tabTypes,
  textTypes,
} from '../../../globals';
import { MapContext } from '../../../contexts';
import { mapTabs } from './constants';
import { convertTimestampToDate } from '../../../utils/datetime';

const MapTabs = ({
  activeTab,
  setActiveTab,
  simulate,
  isSimulating,
  generatePins,
  setPins,
  flyToLocation,
}) => {
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
    gpsDevices,
    updateGpsDevices,
  } = useContext(MapContext);
  const [historyUser, setHistoryUser] = useState(null);

  const logout = (userID) => {
    // 1.) Update latest history of user
    const historiesCopy = JSON.parse(JSON.stringify(histories));
    const retrievedHistory = historiesCopy.filter(
      (h) => !h.timeOut && h.userID === userID
    )[0];
    retrievedHistory.timeOut = Math.floor(Date.now() / 1000);
    updateHistories(historiesCopy);

    // 2.) Remove userLocation, vehicleLocation (if there is), and alertLocation (if there is)
    const filteredUserLocations = userLocations.filter(
      (userLocation) => userLocation.userID !== userID
    );
    updateUserLocations(filteredUserLocations);

    const filteredVehicleLocations = vehicleLocations.filter(
      (vehicleLocation) => vehicleLocation.userID !== userID
    );
    updateVehicleLocations(filteredVehicleLocations);

    const filteredAlertLocations = alertLocations.filter(
      (alertLocation) => alertLocation.userID !== userID
    );
    updateAlertLocations(filteredAlertLocations);

    // 3.) We need to re set pins with the removed userLocation,
    // vehicleLocation, and alertLocation
    const newPins = generatePins([
      ...filteredUserLocations,
      ...filteredVehicleLocations,
      ...filteredAlertLocations,
    ]);
    setPins(newPins);

    // 4.) Remove userID to assigned gpsDevices
    const gpsDevicesCopy = JSON.parse(JSON.stringify(gpsDevices));
    const filteredGpsDevices = gpsDevicesCopy.filter(
      (gpsDevice) => gpsDevice.userID === userID
    );
    filteredGpsDevices.forEach((gpsDevice) => {
      gpsDevice.userID = null;
      gpsDevice.type = null;
    });

    updateGpsDevices(gpsDevicesCopy);
  };

  const usersColumns = [
    {
      name: 'Status',
      button: true,
      cell: (row) => (
        <Badge
          colorName={
            row.status === 'Inactive' ? colorNames.GRAY : colorNames.GREEN
          }
          text={row.status}
        />
      ),
    },
    {
      name: 'User Type',
      selector: (row) => row.userType,
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
      name: 'Sex',
      selector: (row) => row.sex,
      sortable: true,
    },
    {
      name: 'Birth Date',
      selector: (row) => row.birthDate,
    },
    {
      name: 'Address',
      selector: (row) => row.homeAddress,
    },
    {
      name: 'Contact Number',
      selector: (row) => row.contactNumber,
    },
    {
<<<<<<< HEAD:src/screens/Map/MapSidebar/index.js
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
      name: 'Status',
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: 'Action',
      selector: (row) => row.action,
      sortable: false,
      button: true,
      cell: (row) => (
        <>
          <Button
            className={styles.MapSidebar_contents_logoutButton}
            type={buttonTypes.PRIMARY.BLUE}
            onClick={() => logout(row.userID)}
          >
            info
          </Button>
        </>
      ),
    },
  ];

  const historyColumns = [
    {
=======
>>>>>>> 3c77bc115f01ee8c5bdf2461d810acc9f9526d46:src/screens/Map/MapTabs/index.js
      name: 'Action',
      button: true,
      cell: (row) => (
        <>
          <IconButton
            icon="history"
            type={iconButtonTypes.SOLID.SM}
            iconClassName={styles.MapTabs_contents_viewHistoryButton}
            onClick={() =>
              setHistoryUser({
                id: row.id,
                firstName: row.firstName,
                lastName: row.lastName,
              })
            }
          />

          {row.status === 'Active' && (
            <IconButton
              icon="near_me"
              type={iconButtonTypes.SOLID.SM}
              iconClassName={styles.MapTabs_contents_viewLocationButton}
              onClick={() => flyToLocation(row.id)}
            />
          )}
        </>
      ),
    },
  ];

  // Format Users Data
  const activeUsersData = [];
  const inActiveUsersData = [];
  const sortedUsers = users.sort((a, b) =>
    a.lastName.toLowerCase() > b.lastName.toLowerCase() ? 1 : -1
  );
  sortedUsers.forEach((user) => {
    const userLatestHistory = histories
      .filter((h) => h.userID === user.id)
      .sort((a, b) => (a.date < b.date ? 1 : -1))[0];

    const pushUser = {
      ...user,
      dateRegistered: convertTimestampToDate(user.dateRegistered),
      status:
        userLatestHistory?.timeIn && !userLatestHistory?.timeOut
          ? 'Active'
          : 'Inactive',
    };

    if (pushUser.status === 'Active') {
      activeUsersData.push(pushUser);
    } else {
      inActiveUsersData.push(pushUser);
    }
  });
  const usersData = [...activeUsersData, ...inActiveUsersData];

  return (
    <>
      <div className={styles.MapTabs}>
        <Tabs
          className={styles.MapTabs_tabs}
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
          className={styles.MapTabs_simulateButton}
          onClick={simulate}
          disabled={isSimulating}
        >
          Simulate
        </Button>
      </div>

      <>
        {activeTab !== null && (
          <div className={styles.MapTabs_contents}>
            <IconButton
              icon="close"
              iconClassName={styles.MapTabs_contents_closeButton_icon}
              className={styles.MapTabs_contents_closeButton}
              onClick={() => setActiveTab(null)}
            />

            {activeTab === mapTabs.DASHBOARD.value && (
              <>
                <Text
                  type={textTypes.HEADING.XXS}
                  className={styles.MapTabs_contents_title}
                >
                  Dashboard
                </Text>

                <div className={styles.MapTabs_contents_dashboardRow}>
                  <Text
                    type={textTypes.HEADING.XXS}
                    className={styles.MapTabs_contents_dashboardRow_title}
                  >
                    Live Data
                  </Text>

                  <Grid type={gridTypes.THREE}>
                    <Card className={styles.MapTabs_contents_dashboardCard}>
                      <Grid
                        className={styles.MapTabs_contents_dashboardCard_grid}
                      >
                        <div
                          className={
                            styles.MapTabs_contents_dashboardCard_leftColumn
                          }
                        >
                          <Text
                            type={textTypes.HEADING.SM}
                            colorClass={colorClasses.GREEN['400']}
                          >
                            {userLocations.length}
                          </Text>
                          <Text
                            type={textTypes.BODY.MD}
                            colorClass={colorClasses.NEUTRAL['700']}
                          >
                            Number of Active Users
                          </Text>
                        </div>

                        <div
                          className={
                            styles.MapTabs_contents_dashboardCard_rightColumn
                          }
                        >
                          <Icon
                            icon="people"
                            className={cn(
                              styles.MapTabs_contents_dashboardCard_icon,
                              styles.MapTabs_contents_dashboardCard_icon___green
                            )}
                          />
                        </div>
                      </Grid>
                    </Card>

                    <Card className={styles.MapTabs_contents_dashboardCard}>
                      <Grid
                        className={styles.MapTabs_contents_dashboardCard_grid}
                      >
                        <div
                          className={
                            styles.MapTabs_contents_dashboardCard_leftColumn
                          }
                        >
                          <Text
                            type={textTypes.HEADING.SM}
                            colorClass={colorClasses.BLUE['400']}
                          >
                            {vehicleLocations.length}
                          </Text>
                          <Text
                            type={textTypes.BODY.MD}
                            colorClass={colorClasses.NEUTRAL['700']}
                          >
                            Number of Active Vehicles
                          </Text>
                        </div>

                        <div
                          className={
                            styles.MapTabs_contents_dashboardCard_rightColumn
                          }
                        >
                          <Icon
                            icon="directions_car"
                            className={cn(
                              styles.MapTabs_contents_dashboardCard_icon,
                              styles.MapTabs_contents_dashboardCard_icon___blue
                            )}
                          />
                        </div>
                      </Grid>
                    </Card>

                    <Card className={styles.MapTabs_contents_dashboardCard}>
                      <Grid
                        className={styles.MapTabs_contents_dashboardCard_grid}
                      >
                        <div
                          className={
                            styles.MapTabs_contents_dashboardCard_leftColumn
                          }
                        >
                          <Text
                            type={textTypes.HEADING.SM}
                            colorClass={colorClasses.RED['400']}
                          >
                            {alertLocations.length}
                          </Text>
                          <Text
                            type={textTypes.BODY.MD}
                            colorClass={colorClasses.NEUTRAL['700']}
                          >
                            Number of Active Warnings
                          </Text>
                        </div>

                        <div
                          className={
                            styles.MapTabs_contents_dashboardCard_rightColumn
                          }
                        >
                          <Icon
                            icon="warning"
                            className={cn(
                              styles.MapTabs_contents_dashboardCard_icon,
                              styles.MapTabs_contents_dashboardCard_icon___red
                            )}
                          />
                        </div>
                      </Grid>
                    </Card>
                  </Grid>
                </div>

                <div className={styles.MapTabs_contents_dashboardRow}>
                  <Text
                    type={textTypes.HEADING.XXS}
                    className={styles.MapTabs_contents_dashboardRow_title}
                  >
                    Overall Data
                  </Text>

                  <Grid type={gridTypes.THREE}>
                    <Card className={styles.MapTabs_contents_dashboardCard}>
                      <Grid
                        className={styles.MapTabs_contents_dashboardCard_grid}
                      >
                        <div
                          className={
                            styles.MapTabs_contents_dashboardCard_leftColumn
                          }
                        >
                          <Text
                            type={textTypes.HEADING.SM}
                            colorClass={colorClasses.GREEN['400']}
                          >
                            {usersData.length}
                          </Text>
                          <Text
                            type={textTypes.BODY.MD}
                            colorClass={colorClasses.NEUTRAL['700']}
                          >
                            Total Users
                          </Text>
                        </div>

                        <div
                          className={
                            styles.MapTabs_contents_dashboardCard_rightColumn
                          }
                        >
                          <Icon
                            icon="people"
                            className={cn(
                              styles.MapTabs_contents_dashboardCard_icon,
                              styles.MapTabs_contents_dashboardCard_icon___green
                            )}
                          />
                        </div>
                      </Grid>
                    </Card>

                    <Card className={styles.MapTabs_contents_dashboardCard}>
                      <Grid
                        className={styles.MapTabs_contents_dashboardCard_grid}
                      >
                        <div
                          className={
                            styles.MapTabs_contents_dashboardCard_leftColumn
                          }
                        >
                          <Text
                            type={textTypes.HEADING.SM}
                            colorClass={colorClasses.BLUE['400']}
                          >
                            {
                              usersData.filter(
                                (user) => user.userType === 'Personnel'
                              ).length
                            }
                          </Text>
                          <Text
                            type={textTypes.BODY.MD}
                            colorClass={colorClasses.NEUTRAL['700']}
                          >
                            Total Personnels
                          </Text>
                        </div>

                        <div
                          className={
                            styles.MapTabs_contents_dashboardCard_rightColumn
                          }
                        >
                          <Icon
                            icon="badge"
                            className={cn(
                              styles.MapTabs_contents_dashboardCard_icon,
                              styles.MapTabs_contents_dashboardCard_icon___blue
                            )}
                          />
                        </div>
                      </Grid>
                    </Card>

                    <Card className={styles.MapTabs_contents_dashboardCard}>
                      <Grid
                        className={styles.MapTabs_contents_dashboardCard_grid}
                      >
                        <div
                          className={
                            styles.MapTabs_contents_dashboardCard_leftColumn
                          }
                        >
                          <Text
                            type={textTypes.HEADING.SM}
                            colorClass={colorClasses.RED['400']}
                          >
                            {
                              usersData.filter(
                                (user) => user.userType === 'Visitor'
                              ).length
                            }
                          </Text>
                          <Text
                            type={textTypes.BODY.MD}
                            colorClass={colorClasses.NEUTRAL['700']}
                          >
                            Number of Visitors
                          </Text>
                        </div>

                        <div
                          className={
                            styles.MapTabs_contents_dashboardCard_rightColumn
                          }
                        >
                          <Icon
                            icon="person"
                            className={cn(
                              styles.MapTabs_contents_dashboardCard_icon,
                              styles.MapTabs_contents_dashboardCard_icon___red
                            )}
                          />
                        </div>
                      </Grid>
                    </Card>
                  </Grid>
                </div>
              </>
            )}

            {activeTab === mapTabs.CAMP_DATA.value && (
              <>
                <Text
                  type={textTypes.HEADING.XXS}
                  className={styles.MapTabs_contents_title}
                >
                  Camp Data
                </Text>

                <DataTable columns={usersColumns} data={usersData} />

                {historyUser && (
                  <ViewHistoryModal
                    isOpen={historyUser}
                    handleClose={() => setHistoryUser(null)}
                    title={`View History (${historyUser.lastName}, ${historyUser.firstName})`}
                    historyUserId={historyUser.id}
                    logout={logout}
                  />
                )}
              </>
            )}
          </div>
        )}
      </>
    </>
  );
};

MapTabs.defaultProps = {
  isSimulating: false,
};

MapTabs.propTypes = {
  activeTab: PropTypes.string,
  setActiveTab: PropTypes.func.isRequired,
  simulate: PropTypes.func.isRequired,
  isSimulating: PropTypes.bool,
  generatePins: PropTypes.func.isRequired,
  setPins: PropTypes.func.isRequired,
  flyToLocation: PropTypes.func.isRequired,
};

export default MapTabs;
