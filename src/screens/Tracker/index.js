import React from 'react';
import styles from './styles.module.scss';

import { Text } from '../../components/elements';
import { colorClasses, textTypes } from '../../globals';
import PNPLogo from '../../static/images/pnp-logo.png';

const Tracker = () => (
  <div className={styles.Tracker}>
    <img src={PNPLogo} alt="PNP Logo" className={styles.Tracker_logo} />

    <Text type={textTypes.HEADING.SM} colorClass={colorClasses.BLUE[400]}>
      PNP is tracking your location.
      <br />
      You are safe now.
    </Text>
  </div>
);

export default Tracker;
