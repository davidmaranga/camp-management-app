import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

import { Button, Grid, Text } from '../../../components/elements';
import { buttonTypes, textTypes } from '../../../globals';
import { convertTimestampToTimeWithSuffix } from '../../../utils/datetime';
import { checkIsInBuilding } from '../../../utils/map';

const PinPopup = ({ location, user, userLatestHistory, resolveAlert }) => (
  <div className={styles.PinPopup}>
    <Grid className={styles.PinPopup_grid}>
      <Text
        type={textTypes.BODY.XS}
        className={cn(styles.PinPopup_grid_column, styles.PinPopup_grid_label)}
      >
        First Name
      </Text>
      <Text
        type={textTypes.BODY.XS}
        className={cn(styles.PinPopup_grid_column, styles.PinPopup_grid_value)}
      >
        {user.firstName}
      </Text>
    </Grid>

    <Grid className={styles.PinPopup_grid}>
      <Text
        type={textTypes.BODY.XS}
        className={cn(styles.PinPopup_grid_column, styles.PinPopup_grid_label)}
      >
        Last Name
      </Text>
      <Text
        type={textTypes.BODY.XS}
        className={cn(styles.PinPopup_grid_column, styles.PinPopup_grid_value)}
      >
        {user.lastName}
      </Text>
    </Grid>

    <Grid className={styles.PinPopup_grid}>
      <Text
        type={textTypes.BODY.XS}
        className={cn(styles.PinPopup_grid_column, styles.PinPopup_grid_label)}
      >
        Contact Number
      </Text>
      <Text
        type={textTypes.BODY.XS}
        className={cn(styles.PinPopup_grid_column, styles.PinPopup_grid_value)}
      >
        {user.contactNumber}
      </Text>
    </Grid>

    {userLatestHistory.plateNumber && (
      <Grid className={styles.PinPopup_grid}>
        <Text
          type={textTypes.BODY.XS}
          className={cn(
            styles.PinPopup_grid_column,
            styles.PinPopup_grid_label
          )}
        >
          Plate Number
        </Text>
        <Text
          type={textTypes.BODY.XS}
          className={cn(
            styles.PinPopup_grid_column,
            styles.PinPopup_grid_value
          )}
        >
          {userLatestHistory.plateNumber}
        </Text>
      </Grid>
    )}

    {userLatestHistory.color && (
      <Grid className={styles.PinPopup_grid}>
        <Text
          type={textTypes.BODY.XS}
          className={cn(
            styles.PinPopup_grid_column,
            styles.PinPopup_grid_label
          )}
        >
          Color
        </Text>
        <Text
          type={textTypes.BODY.XS}
          className={cn(
            styles.PinPopup_grid_column,
            styles.PinPopup_grid_value
          )}
        >
          {userLatestHistory.color}
        </Text>
      </Grid>
    )}

    {userLatestHistory.brand && (
      <Grid className={styles.PinPopup_grid}>
        <Text
          type={textTypes.BODY.XS}
          className={cn(
            styles.PinPopup_grid_column,
            styles.PinPopup_grid_label
          )}
        >
          Brand
        </Text>
        <Text
          type={textTypes.BODY.XS}
          className={cn(
            styles.PinPopup_grid_column,
            styles.PinPopup_grid_value
          )}
        >
          {userLatestHistory.brand}
        </Text>
      </Grid>
    )}

    {userLatestHistory.model && (
      <Grid className={styles.PinPopup_grid}>
        <Text
          type={textTypes.BODY.XS}
          className={cn(
            styles.PinPopup_grid_column,
            styles.PinPopup_grid_label
          )}
        >
          Model
        </Text>
        <Text
          type={textTypes.BODY.XS}
          className={cn(
            styles.PinPopup_grid_column,
            styles.PinPopup_grid_value
          )}
        >
          {userLatestHistory.model}
        </Text>
      </Grid>
    )}

    <Grid className={styles.PinPopup_grid}>
      <Text
        type={textTypes.BODY.XS}
        className={cn(styles.PinPopup_grid_column, styles.PinPopup_grid_label)}
      >
        Current Location
      </Text>
      <Text
        type={textTypes.BODY.XS}
        className={cn(styles.PinPopup_grid_column, styles.PinPopup_grid_value)}
      >
        {checkIsInBuilding(location.longitude, location.latitude) || 'Outside'}
      </Text>
    </Grid>

    {location.lastSeen && (
      <Grid className={styles.PinPopup_grid}>
        <Text
          type={textTypes.BODY.XS}
          className={cn(
            styles.PinPopup_grid_column,
            styles.PinPopup_grid_label
          )}
        >
          Last Seen
        </Text>
        <Text
          type={textTypes.BODY.XS}
          className={cn(
            styles.PinPopup_grid_column,
            styles.PinPopup_grid_value
          )}
        >
          {convertTimestampToTimeWithSuffix(location.lastSeen)}
        </Text>
      </Grid>
    )}

    {location.lastSeen && (
      <Button
        type={buttonTypes.PRIMARY.GREEN}
        className={styles.PinPopup_grid_resolveButton}
        onClick={() => resolveAlert(location.id)}
      >
        Resolve
      </Button>
    )}
  </div>
);

PinPopup.propTypes = {
  location: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  userLatestHistory: PropTypes.object.isRequired,
  resolveAlert: PropTypes.func.isRequired,
};

export default PinPopup;
