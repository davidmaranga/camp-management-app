import React, { useContext } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

import { DataTable } from '../..';
import { Button, Modal } from '../../elements';
import { buttonTypes, modalSizes } from '../../../globals';
import { MapContext } from '../../../contexts';
import {
  convertTimestampToDate,
  convertTimestampToTimeWithSuffix,
} from '../../../utils/datetime';

const ViewHistoryModal = ({
  isOpen,
  handleClose,
  title,
  historyUserId,
  logout,
}) => {
  const { histories } = useContext(MapContext);

  const historyColumns = [
    {
      name: 'Action',
      button: true,
      cell: (row) => (
        <>
          {row.timeOut === '-' ? (
            <Button
              className={styles.ViewHistoryModal_logoutButton}
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
      minWidth: '120px',
    },
    {
      name: 'Time In',
      selector: (row) => row.timeIn,
      sortable: true,
      minWidth: '120px',
    },
    {
      name: 'Time Out',
      selector: (row) => row.timeOut,
      sortable: true,
      minWidth: '120px',
    },
    {
      name: 'Intended Offices to Visit',
      selector: (row) => row.intendedOfficesToVisit,
      minWidth: '200px',
      cell: (row) => (
        <ul className={styles.ViewHistoryModal_offices}>
          {row.intendedOfficesToVisit.map((office, i) => (
            <li
              key={i}
              className={cn(styles.ViewHistoryModal_offices_list, {
                [styles.ViewHistoryModal_offices_list___okay]:
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
            <ul className={styles.ViewHistoryModal_offices}>
              {row.officesVisited.map((office, i) => (
                <li
                  key={i}
                  className={cn(styles.ViewHistoryModal_offices_list, {
                    [styles.ViewHistoryModal_offices_list___okay]:
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
    },
    {
      name: 'Vehicle GPS Device',
      selector: (row) => row.vehicleGpsDevice,
      minWidth: '180px',
    },
    {
      name: 'Plate Number',
      selector: (row) => row.plateNumber,
      minWidth: '150px',
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

  // Format Histories Data
  const historiesData = [];
  const filteredHistories = histories
    .filter((history) => history.userID === historyUserId)
    .sort((a, b) => {
      if (a.timeOut > b.timeOut) return -1;
      if (a.timeOut < b.timeOut) return 1;
      if (a.date > b.date) return -1;
      if (a.date < b.date) return 1;
      return 0;
    });
  filteredHistories.forEach((history) => {
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
    <Modal
      className={styles.ViewHistoryModal}
      size={modalSizes.LG}
      isOpen={isOpen}
      handleClose={handleClose}
      title={title}
    >
      <DataTable columns={historyColumns} data={historiesData} />
    </Modal>
  );
};

ViewHistoryModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  historyUserId: PropTypes.number.isRequired,
  logout: PropTypes.func.isRequired,
};

export default ViewHistoryModal;
