import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './styles.module.scss';

import { Label, Text } from '..';
import { colorClasses, textTypes } from '../../../globals';

const Checkbox = ({
  name,
  children,
  error,
  checked,
  className,
  labelClassName,
  onChange,
  disabled,
}) => (
  <div
    className={cn(className, styles.Checkbox, {
      [styles.Checkbox___disabled]: disabled,
    })}
  >
    <input
      data-test="checkbox"
      type="checkbox"
      className={styles.Checkbox_input}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      name={name}
      id={name}
    />
    <Label
      className={cn(styles.Checkbox_label, labelClassName)}
      htmlFor={name}
      disabled={disabled}
    >
      {children}
    </Label>

    {error && (
      <div className={styles.Input_helperTextContainer}>
        <Text type={textTypes.BODY.XS} colorClass={colorClasses.RED['400']}>
          {error}
        </Text>
      </div>
    )}
  </div>
);

Checkbox.defaultProps = {
  checked: false,
  className: null,
  error: null,
  disabled: false,
};

Checkbox.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired,
  error: PropTypes.string,
  checked: PropTypes.bool,
  className: PropTypes.string,
  labelClassName: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default Checkbox;
