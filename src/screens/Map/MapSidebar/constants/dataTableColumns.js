export const usersColumns = [
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

export const historyColumns = [
  {
    name: 'Action',
    button: true,
    cell: () => <button type="button">Logout</button>,
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
      <ul className="data-table-custom-ul">
        {row.intendedOfficesToVisit.map((office) => (
          <li>{office}</li>
        ))}
      </ul>
    ),
  },
  {
    name: 'Offices Visited',
    selector: (row) => row.officesVisited,
    minWidth: '150px',
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
