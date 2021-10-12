import React from 'react';
import PropTypes from 'prop-types';
import ReactDataTable from 'react-data-table-component';
import ReactDataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';

const customStyles = {
  cells: {
    style: {
      paddingTop: '12px',
      paddingBottom: '12px',
    },
  },
  headCells: {
    style: {
      paddingLeft: '12px', // override the cell padding for head cells
      paddingRight: '12px',
      backgroundColor: '#f3f3f3', // set the background color of the th
      color: '#55b9df', // set the color fo header text
    },
  },
};

const DataTable = ({ columns, data, filter, expandableRowsComponent }) => (
  <ReactDataTableExtensions
    {...{
      columns,
      data,
    }}
    defaultSortField="firstName"
    defaultSortAsc={false}
    export={false}
    print={false}
    filter={filter}
  >
    <ReactDataTable
      highlightOnHover
      pagination
      dense
      persistTableHead
      expandableRows={!!expandableRowsComponent}
      expandableRowsComponent={expandableRowsComponent}
      customStyles={customStyles}
    />
  </ReactDataTableExtensions>
);

DataTable.defaultProps = {
  filter: true,
};

DataTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  filter: PropTypes.bool,
  expandableRowsComponent: PropTypes.func,
};

export default DataTable;
