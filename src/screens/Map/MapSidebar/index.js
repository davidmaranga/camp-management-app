import React, { useContext, useState } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

import { DataTable } from '../../../components';
import {
  Button,
  Card,
  Grid,
  Icon,
  IconButton,
  Tabs,
  Text,
} from '../../../components/elements';
import {
  buttonTypes,
  colorClasses,
  gridTypes,
  tabTypes,
  textTypes,
} from '../../../globals';
import { MapContext } from '../../../contexts';
import { mapTabs } from './constants';
import {
  convertTimestampToDate,
  convertTimestampToTimeWithSuffix,
} from '../../../utils/datetime';

const MapSidebar = ({ simulate, isSimulating, generatePins, setPins }) => {
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
  const [activeTab, setActiveTab] = useState(null);

  const logout = (userID) => {
    // 1.) Update latest history of user
    const historiesCopy = JSON.parse(JSON.stringify(histories));
    const retrievedHistory = historiesCopy.find((h) => h.userID === userID);
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
      name: 'Status',
      selector: (row) => row.status,
      sortable: true,
    },
  ];

  const historyColumns = [
    {
      name: 'Action',
      button: true,
      cell: (row) => (
        <>
          {row.timeOut === '-' ? (
            <Button
              className={styles.MapSidebar_contents_logoutButton}
              type={buttonTypes.PRIMARY.RED}
              onClick={() => logout(row.userID)}
            >
              Logout
            </Button>
          ) : (
            '-'
          )}
        </>
      ),
    },
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
      name: 'Intended Offices to Visit',
      selector: (row) => row.intendedOfficesToVisit,
      minWidth: '200px',
      cell: (row) => (
        <ul className={styles.MapSidebar_contents_offices}>
          {row.intendedOfficesToVisit.map((office, i) => (
            <li
              key={i}
              className={cn(styles.MapSidebar_contents_offices_list, {
                [styles.MapSidebar_contents_offices_list___okay]:
                  row.officesVisited.find(
                    (officeVisited) => officeVisited === office
                  ),
              })}
            >
              {office}
            </li>
          ))}
        </ul>
      ),
    },
    {
      name: 'Offices Visited',
      selector: (row) => row.officesVisited,
      minWidth: '150px',
      cell: (row) => (
        <>
          {row.officesVisited.length ? (
            <ul className={styles.MapSidebar_contents_offices}>
              {row.officesVisited.map((office, i) => (
                <li
                  key={i}
                  className={cn(styles.MapSidebar_contents_offices_list, {
                    [styles.MapSidebar_contents_offices_list___okay]:
                      row.intendedOfficesToVisit.find(
                        (intendedOffice) => intendedOffice === office
                      ),
                  })}
                >
                  {office}
                </li>
              ))}
            </ul>
          ) : (
            '-'
          )}
        </>
      ),
    },
    {
      name: 'User GPS Device',
      selector: (row) => row.userGpsDevice,
      minWidth: '150px',
      sortable: true,
    },
    {
      name: 'Vehicle GPS Device',
      selector: (row) => row.vehicleGpsDevice,
      minWidth: '180px',
      sortable: true,
    },
    {
      name: 'Plate Number',
      selector: (row) => row.plateNumber,
      minWidth: '120px',
      sortable: true,
    },
    {
      name: 'Color',
      selector: (row) => row.color,
      sortable: true,
    },
    {
      name: 'Brand',
      selector: (row) => row.brand,
      sortable: true,
    },
    {
      name: 'Model',
      selector: (row) => row.model,
      sortable: true,
    },
  ];

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
      officesVisited: history?.officesVisited ? history?.officesVisited : [],
      userGpsDevice: history?.userGpsDevice ? history?.userGpsDevice : [],
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

            {activeTab === mapTabs.DASHBOARD.value && (
              <>
                <Text
                  type={textTypes.HEADING.XXS}
                  className={styles.MapSidebar_contents_title}
                >
                  Dashboard
                </Text>

                <div className={styles.MapSidebar_contents_dashboardRow}>
                  <Text
                    type={textTypes.HEADING.XXS}
                    className={styles.MapSidebar_contents_dashboardRow_title}
                  >
                    Live Data
                  </Text>

                  <Grid type={gridTypes.THREE}>
                    <Card className={styles.MapSidebar_contents_dashboardCard}>
                      <Grid
                        className={
                          styles.MapSidebar_contents_dashboardCard_grid
                        }
                      >
                        <div
                          className={
                            styles.MapSidebar_contents_dashboardCard_leftColumn
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
                            styles.MapSidebar_contents_dashboardCard_rightColumn
                          }
                        >
                          <Icon
                            icon="people"
                            className={cn(
                              styles.MapSidebar_contents_dashboardCard_icon,
                              styles.MapSidebar_contents_dashboardCard_icon___green
                            )}
                          />
                        </div>
                      </Grid>
                    </Card>

                    <Card className={styles.MapSidebar_contents_dashboardCard}>
                      <Grid
                        className={
                          styles.MapSidebar_contents_dashboardCard_grid
                        }
                      >
                        <div
                          className={
                            styles.MapSidebar_contents_dashboardCard_leftColumn
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
                            styles.MapSidebar_contents_dashboardCard_rightColumn
                          }
                        >
                          <Icon
                            icon="directions_car"
                            className={cn(
                              styles.MapSidebar_contents_dashboardCard_icon,
                              styles.MapSidebar_contents_dashboardCard_icon___blue
                            )}
                          />
                        </div>
                      </Grid>
                    </Card>

                    <Card className={styles.MapSidebar_contents_dashboardCard}>
                      <Grid
                        className={
                          styles.MapSidebar_contents_dashboardCard_grid
                        }
                      >
                        <div
                          className={
                            styles.MapSidebar_contents_dashboardCard_leftColumn
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
                            styles.MapSidebar_contents_dashboardCard_rightColumn
                          }
                        >
                          <Icon
                            icon="warning"
                            className={cn(
                              styles.MapSidebar_contents_dashboardCard_icon,
                              styles.MapSidebar_contents_dashboardCard_icon___red
                            )}
                          />
                        </div>
                      </Grid>
                    </Card>
                  </Grid>
                </div>

                <div className={styles.MapSidebar_contents_dashboardRow}>
                  <Text
                    type={textTypes.HEADING.XXS}
                    className={styles.MapSidebar_contents_dashboardRow_title}
                  >
                    Overall Data
                  </Text>

                  <Grid type={gridTypes.THREE}>
                    <Card className={styles.MapSidebar_contents_dashboardCard}>
                      <Grid
                        className={
                          styles.MapSidebar_contents_dashboardCard_grid
                        }
                      >
                        <div
                          className={
                            styles.MapSidebar_contents_dashboardCard_leftColumn
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
                            styles.MapSidebar_contents_dashboardCard_rightColumn
                          }
                        >
                          <Icon
                            icon="people"
                            className={cn(
                              styles.MapSidebar_contents_dashboardCard_icon,
                              styles.MapSidebar_contents_dashboardCard_icon___green
                            )}
                          />
                        </div>
                      </Grid>
                    </Card>

                    <Card className={styles.MapSidebar_contents_dashboardCard}>
                      <Grid
                        className={
                          styles.MapSidebar_contents_dashboardCard_grid
                        }
                      >
                        <div
                          className={
                            styles.MapSidebar_contents_dashboardCard_leftColumn
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
                            styles.MapSidebar_contents_dashboardCard_rightColumn
                          }
                        >
                          <Icon
                            icon="badge"
                            className={cn(
                              styles.MapSidebar_contents_dashboardCard_icon,
                              styles.MapSidebar_contents_dashboardCard_icon___blue
                            )}
                          />
                        </div>
                      </Grid>
                    </Card>

                    <Card className={styles.MapSidebar_contents_dashboardCard}>
                      <Grid
                        className={
                          styles.MapSidebar_contents_dashboardCard_grid
                        }
                      >
                        <div
                          className={
                            styles.MapSidebar_contents_dashboardCard_leftColumn
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
                            styles.MapSidebar_contents_dashboardCard_rightColumn
                          }
                        >
                          <Icon
                            icon="person"
                            className={cn(
                              styles.MapSidebar_contents_dashboardCard_icon,
                              styles.MapSidebar_contents_dashboardCard_icon___red
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
  generatePins: PropTypes.func.isRequired,
  setPins: PropTypes.func.isRequired,
};

export default MapSidebar;
