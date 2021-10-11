import React from 'react';
import PropTypes from 'prop-types';
import ReactDataTable from 'react-data-table-component';
import ReactDataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';

import { colorHexCodes } from '../../globals';

const customStyles = {
  headCells: {
    style: {
      backgroundColor: colorHexCodes.NEUTRAL['100'],
      fontSize: 14,
      fontWeight: 700,
    },
  },
  cells: {
    style: {
      fontSize: 14,
      paddingTop: 5,
      paddingBottom: 5,
    },
  },
};

const DataTable = ({ columns, data, filter }) => (
  <div>
    <ReactDataTableExtensions
      {...{
        columns,
        data,
      }}
      export={false}
      print={false}
      filter={filter}
    >
      <ReactDataTable
        highlightOnHover
        pagination
        persistTableHead
        customStyles={customStyles}
      />
    </ReactDataTableExtensions>
  </div>
);

DataTable.defaultProps = {
  filter: true,
};

DataTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  filter: PropTypes.bool,
};

export default DataTable;
