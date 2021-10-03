import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { components } from 'react-select';
import styles from './styles.module.scss';

import { Text } from '../../..';
import { colorClasses, selectTypes, textTypes } from '../../../../../globals';

const { ValueContainer } = components;

/* eslint-disable react/jsx-props-no-spreading  */
const CustomValueContainer = (props) => {
  const { children, type, selectProps, hasValue } = props;
  const shouldFloatLabel = selectProps.menuIsOpen || hasValue;

  return (
    <ValueContainer {...props}>
      <div
        className={cn(styles.CustomValueContainer, {
          [styles.CustomValueContainer_center]: type === selectTypes.SLIM,
        })}
      >
        {type === selectTypes.FORM && shouldFloatLabel && (
          <Text
            className={styles.CustomValueContainer_label}
            type={textTypes.BODY.MD}
            colorClass={colorClasses.NEUTRAL['500']}
          >
            {selectProps.placeholder}
          </Text>
        )}
        {children}
      </div>
    </ValueContainer>
  );
};

CustomValueContainer.propTypes = {
  // the default selectProps from `react-select`
  selectProps: PropTypes.object.isRequired,

  // true if the parent <Select /> has a value
  hasValue: PropTypes.bool.isRequired,

  // the type of the parent <Select />
  type: PropTypes.oneOf([
    selectTypes.FORM,
    selectTypes.SLIM,
    selectTypes.PLAYGROUND,
    selectTypes.LARGE,
  ]),

  children: PropTypes.any.isRequired,
};

export default CustomValueContainer;
