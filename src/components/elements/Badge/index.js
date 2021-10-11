import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

import { Icon } from '..';
import { colorNames } from '../../../globals';

const Badge = ({ className, icon, text, colorName }) => (
  <div className={cn(className, styles[`Badge___${colorName}`])}>
    {icon && <Icon className={styles.Badge_icon} icon={icon} />}
    <span
      className={cn({
        [styles.Badge_text___withIcon]: icon,
        [styles.Badge_text___noIcon]: !icon,
      })}
    >
      {text}
    </span>
  </div>
);

Badge.defaultProps = {
  className: null,
  icon: null,
  colorName: colorNames.GREEN,
  text: null,
};

Badge.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string,
  colorName: PropTypes.oneOf([
    colorNames.GREEN,
    colorNames.BLUE,
    colorNames.RED,
    colorNames.GRAY,
  ]),
  text: PropTypes.string,
};

export default Badge;
