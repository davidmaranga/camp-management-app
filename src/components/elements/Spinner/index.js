import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

import { colorNames, spinnerSizes } from '../../../globals';

const Spinner = ({ className, colorName, size }) => (
  <div className={cn(styles.Spinner_container, className)}>
    <svg className={styles[`Spinner___${size}`]} viewBox="25 25 50 50">
      <circle
        className={styles[`Spinner_circle___${colorName}`]}
        cx="50"
        cy="50"
        r="20"
      />
    </svg>
  </div>
);

Spinner.defaultProps = {
  className: null,
  colorName: colorNames.BLUE,
  size: spinnerSizes.LG,
};

Spinner.propTypes = {
  className: PropTypes.string,
  colorName: PropTypes.oneOf([
    colorNames.GRAY,
    colorNames.BLUE,
    colorNames.WHITE,
  ]),
  size: PropTypes.oneOf([
    spinnerSizes.LG,
    spinnerSizes.MD,
    spinnerSizes.SM,
    spinnerSizes.XS,
  ]),
};

export default Spinner;
