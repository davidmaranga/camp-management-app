import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

import { gridTypes } from '../../../globals';

const Grid = ({ className, type, children }) => (
  <div className={cn(className, styles[`Grid___${type}`])}>{children}</div>
);

Grid.defaultProps = {
  className: null,
  type: gridTypes.TWO,
};

Grid.propTypes = {
  children: PropTypes.any.isRequired,
  className: PropTypes.string,
  type: PropTypes.oneOf([
    gridTypes.ONE,
    gridTypes.TWO,
    gridTypes.THREE,
    gridTypes.FOUR,
  ]),
};

export default Grid;
