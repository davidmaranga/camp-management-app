import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from '../input.module.scss';

import { Icon, Text } from '../..';
import { colorClasses, inputTypes, textTypes } from '../../../../globals';

const DatePicker = ({
  className,
  inputClassName,
  dateFormat,
  label,
  type,
  icon,
  name,
  selected,
  placeholder,
  helperText,
  success,
  error,
  disabled,
  onChange,
  onBlur,
  tabIndex,
  disableFutureDates,
}) => (
  <div className={cn(className, styles.Input_container)}>
    {label && type === inputTypes.SLIM && (
      <Text
        className={styles.Input___slim_label}
        type={textTypes.BODY.MD}
        colorClass={colorClasses.NEUTRAL['500']}
      >
        {label}
      </Text>
    )}

    <ReactDatePicker
      className={cn(inputClassName, styles[`Input___${type}`], {
        [styles[`Input___${type}___icon`]]: icon !== null,
        [styles.Input___success]: success !== null,
        [styles.Input___error]: error !== null,
      })}
      dateFormat={dateFormat}
      id={name}
      name={name}
      selected={selected}
      disabled={disabled}
      onChange={onChange}
      onBlur={onBlur}
      tabIndex={tabIndex}
      maxDate={disableFutureDates ? new Date() : undefined}
      autoComplete="off"
    />

    {placeholder && type === inputTypes.FORM && (
      <Text
        className={cn(styles.Input___form_label, {
          [styles.Input___form_label___active]: selected !== '',
        })}
        type={textTypes.BODY.MD}
        colorClass={colorClasses.NEUTRAL['500']}
      >
        {placeholder}
      </Text>
    )}

    {icon && <Icon className={styles[`Input___${type}_icon`]} icon={icon} />}

    {(helperText || success || error) && (
      <div className={styles.Input_helperTextContainer}>
        {helperText && (
          <Text
            type={textTypes.BODY.XS}
            colorClass={colorClasses.NEUTRAL['500']}
          >
            {helperText}
          </Text>
        )}

        {error && (
          <Text type={textTypes.BODY.XS} colorClass={colorClasses.RED['400']}>
            {error}
          </Text>
        )}

        {success && (
          <Text type={textTypes.BODY.XS} colorClass={colorClasses.GREEN['400']}>
            {success}
          </Text>
        )}
      </div>
    )}
  </div>
);

DatePicker.defaultProps = {
  className: null,
  inputClassName: null,
  label: null,
  type: inputTypes.SLIM,
  icon: null,
  selected: null,
  placeholder: null,
  helperText: null,
  success: null,
  error: null,
  disabled: false,
  onBlur: () => {},
  tabIndex: null,
  disableFutureDates: false,
};

DatePicker.propTypes = {
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  dateFormat: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.oneOf([inputTypes.FORM, inputTypes.SLIM]),
  icon: PropTypes.string,
  name: PropTypes.string.isRequired,
  selected: PropTypes.instanceOf(Date),
  placeholder: PropTypes.string,
  helperText: PropTypes.string,
  success: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  tabIndex: PropTypes.number,
  disableFutureDates: PropTypes.bool,
};

export default DatePicker;
