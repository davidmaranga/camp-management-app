import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

import { tabTypes } from '../../../globals';

import TabButton from './TabButton';

const Tabs = ({ type, activeTab, tabs, className, tabClassName }) => (
  <div className={cn(className, styles[`Tabs___${type}`])}>
    {tabs?.map(({ name, value, action, closeAction, id }) => (
      <TabButton
        key={value}
        className={cn(styles.Tabs_button, tabClassName)}
        onClick={action}
        type={type}
        active={activeTab === value}
        id={id}
        closeAction={
          type === tabTypes.HORIZONTAL.SM && closeAction ? closeAction : null
        }
      >
        {name}
      </TabButton>
    ))}
  </div>
);

Tabs.defaultProps = {
  className: null,
  tabClassName: null,
  activeTab: null,
};

Tabs.propTypes = {
  className: PropTypes.string,
  tabClassName: PropTypes.string,
  type: PropTypes.oneOf([
    tabTypes.HORIZONTAL.LG,
    tabTypes.HORIZONTAL.SM,
    tabTypes.VERTICAL.LG,
    tabTypes.VERTICAL.SM,
  ]).isRequired,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      action: PropTypes.func.isRequired,
      closeAction: PropTypes.func,
      id: PropTypes.string,
    })
  ).isRequired,
  activeTab: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Tabs;
