import React, { useState } from 'react';
import { MDBDataTableV5 } from 'mdbreact';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import styles from './styles.module.scss';

import { Card, Text } from '../../components/elements';
import { textTypes } from '../../globals';

const Users = () => {
  const [datatable, setDatatable] = useState({
    columns: [
      {
        label: 'First Name',
        field: 'firstName',
        width: 100,
      },
      {
        label: 'Last Name',
        field: 'lastName',
        width: 100,
      },
      {
        label: 'Sex',
        field: 'sex',
        width: 100,
      },
      {
        label: 'Birthdate',
        field: 'birthDate',
        width: 50,
      },
      {
        label: 'Home Address',
        field: 'homeAddress',
        sort: 'disabled',
        width: 150,
      },
      {
        label: 'Contact Number',
        field: 'contactNumber',
        sort: 'disabled',
        width: 100,
      },
      {
        label: 'User Type',
        field: 'userType',
        width: 100,
      },
      {
        label: 'Date Registered',
        field: 'dateRegistered',
        width: 100,
      },
      {
        label: 'GPS Device',
        field: 'gpsDevice',
        width: 100,
      },
      {
        label: 'Time In',
        field: 'timeIn',
        width: 100,
      },
      {
        label: 'Time Out',
        field: 'timeOut',
        width: 100,
      },
      {
        label: 'Vehicle',
        field: 'vehicle',
        width: 100,
      },
    ],
    rows: JSON.parse(localStorage.getItem('users')),
  });

  return (
    <div className={styles.Users}>
      <Card className={styles.Users_card}>
        <Text type={textTypes.HEADING.XS} className={styles.Users_title}>
          All Users
        </Text>

        <MDBDataTableV5
          hover
          entriesOptions={[5, 20, 25]}
          entries={5}
          pagesAmount={4}
          data={datatable}
        />
      </Card>
    </div>
  );
};

export default Users;
