import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import Select from 'react-select';
import formStyles from '../styles/formStyles';
import styles from './styles.module.scss';

import CustomOption from '../custom/Option';
import CustomSingleValue from '../custom/SingleValue';
import CustomValueContainer from '../custom/ValueContainer';

import { Text } from '../..';
import {
  colorClasses,
  colorHexCodes,
  selectTypes,
  textTypes,
} from '../../../../globals';

const ControlledSelect = ({
  className,
  innerClassName,
  options,
  isMulti,
  name,
  type,
  label,
  value,
  placeholder,
  helperText,
  error,
  onChange,
  isClearable,
  disabled,
}) => (
  <div className={cn(className, styles.Select)} id={name}>
    {label && type === selectTypes.SLIM && (
      <Text
        className={styles.Select___slim_label}
        type={textTypes.BODY.MD}
        colorClass={colorClasses.NEUTRAL['500']}
      >
        {label}
      </Text>
    )}

    <Select
      styles={{
        ...formStyles,
        control: (base, state) => ({
          ...base,
          backgroundColor: state.isDisabled
            ? colorHexCodes.NEUTRAL['100']
            : null,
          borderRadius: '4px',
          borderWidth: 1,
          // eslint-disable-next-line no-nested-ternary
          borderColor: error
            ? colorHexCodes.RED['400']
            : state.menuIsOpen
            ? colorHexCodes.BLUE['300']
            : colorHexCodes.NEUTRAL['300'],
          boxShadow: null,
          padding: '8px 14px',

          '&:hover': {},
        }),
      }}
      className={innerClassName}
      options={options}
      name={name}
      value={value}
      isMulti={isMulti}
      onChange={onChange}
      placeholder={placeholder}
      isDisabled={disabled}
      menuPosition="fixed"
      components={{
        Option: CustomOption,
        SingleValue: CustomSingleValue,
        // eslint-disable-next-line react/display-name
        ValueContainer: (valueContainerProps) => (
          // eslint-disable-next-line react/jsx-props-no-spreading
          <CustomValueContainer type={type} {...valueContainerProps} />
        ),
        IndicatorSeparator: null,
      }}
      isClearable={isClearable}
    />

    {(helperText || error) && (
      <div className={styles.Select_helperTextContainer}>
        {helperText && (
          <Text
            className={styles.Select_helperText}
            type={textTypes.BODY.XS}
            colorClass={colorClasses.NEUTRAL['400']}
          >
            {helperText}
          </Text>
        )}
        {error && (
          <Text
            data-test="inputError"
            type={textTypes.BODY.XS}
            colorClass={colorClasses.RED['400']}
          >
            {error}
          </Text>
        )}
      </div>
    )}
  </div>
);

ControlledSelect.defaultProps = {
  className: null,
  innerClassName: null,
  type: selectTypes.SLIM,
  label: null,
  value: null,
  isMulti: false,
  placeholder: null,
  helperText: null,
  error: null,
  isClearable: false,
  disabled: false,
};

ControlledSelect.propTypes = {
  className: PropTypes.string,
  innerClassName: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool,
        PropTypes.object,
      ]).isRequired,
      label: PropTypes.string.isRequired,

      // custom icon in each option (a custom component)
      icon: PropTypes.element,
    })
  ).isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf([selectTypes.FORM, selectTypes.SLIM]),
  label: PropTypes.string,
  isMulti: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.shape({
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool,
        PropTypes.object,
      ]).isRequired,
      label: PropTypes.string.isRequired,

      // custom icon in each option (a custom component)
      icon: PropTypes.element,
    }),
    PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
          PropTypes.bool,
        ]).isRequired,
        label: PropTypes.string.isRequired,

        // custom icon in each option (a custom component)
        icon: PropTypes.element,
      })
    ),
  ]),
  placeholder: PropTypes.string,
  helperText: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  isClearable: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default ControlledSelect;
