import React, { useState } from 'react';
import styles from './styles.module.scss';

import { SweetAlert } from '../../components';
import { Button, Text } from '../../components/elements';
import { buttonTypes, colorClasses, textTypes } from '../../globals';

const Tracker = () => {
  const [showSwal, setShowSwal] = useState(false);

  return (
    <div className={styles.Tracker}>
      <Text type={textTypes.HEADING.SM} colorClass={colorClasses.GREEN[400]}>
        PNP is tracking your location.
        <br />
        You are safe now.
      </Text>

      <Button
        type={buttonTypes.PRIMARY.RED}
        className={styles.Tracker_logoutButton}
        onClick={() => setShowSwal(true)}
      >
        Logout
      </Button>

      <SweetAlert
        show={showSwal}
        title="You are still not outside the camp."
        onConfirm={() => setShowSwal(false)}
        onCancel={() => setShowSwal(false)}
      >
        Logging out will notify the PNP admins and will consider you suspicious.
      </SweetAlert>
    </div>
  );
};

export default Tracker;
