import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import dateFormat from 'dateformat';
import isEmpty from 'lodash/isEmpty';
import styles from './styles.module.scss';

import {
  Button,
  Card,
  ControlledInput,
  ControlledSelect,
  Grid,
  DatePicker,
  Spinner,
  Text,
} from '../../components/elements';
import {
  buttonKinds,
  colorNames,
  sexTypes,
  textTypes,
  spinnerSizes,
  userTypes,
} from '../../globals';

const Registration = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userIsFound, setUserIsFound] = useState(false);
  const [gpsDevicesOptions, setGpsDevicesOptions] = useState([]);

  const validate = (values) => {
    const errors = {};

    if (!values.firstName) {
      errors.firstName = 'This field is required.';
    }

    if (!values.lastName) {
      errors.lastName = 'This field is required.';
    }

    if (!values.sex.value && !userIsFound) {
      errors.sex = 'This field is required.';
    }

    if (!values.birthDate && !userIsFound) {
      errors.birthDate = 'This field is required.';
    }

    if (!values.homeAddress && !userIsFound) {
      errors.homeAddress = 'This field is required.';
    }

    if (!values.contactNumber && !userIsFound) {
      errors.contactNumber = 'This field is required.';
    }

    if (!values.userType.value && !userIsFound) {
      errors.userType = 'This field is required.';
    }

    if (!values.gpsDevice.value) {
      errors.gpsDevice = 'This field is required.';
    }

    return errors;
  };

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    setUserIsFound(
      users.find(
        (user) =>
          user.firstName.toLowerCase() === firstName.toLowerCase() &&
          user.lastName.toLowerCase() === lastName.toLowerCase()
      )
    );
  }, [firstName, lastName]);

  useEffect(() => {
    const options = [];
    const allGpsDevices = JSON.parse(localStorage.getItem('gpsDevices'));

    allGpsDevices.forEach((gpsDevice) => {
      if (!gpsDevice.isAssigned) {
        options.push({
          label: gpsDevice.id,
          value: gpsDevice.id,
        });
      }
    });

    setGpsDevicesOptions(options);
  }, []);

  return (
    <div className={styles.Registration}>
      <Card className={styles.Registration_card}>
        <Text type={textTypes.HEADING.XS} className={styles.Registration_title}>
          {!userIsFound ? 'Registration Form' : 'Assign GPS Device'}
        </Text>

        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            sex: {
              label: sexTypes.MALE,
              value: sexTypes.MALE,
            },
            birthDate: '',
            homeAddress: '',
            contactNumber: '',
            userType: {
              label: userTypes.VISITOR,
              value: userTypes.VISITOR,
            },
            gpsDevice: {
              label: 'Select...',
              value: null,
            },
          }}
          onSubmit={async (values, { setErrors, setFieldValue }) => {
            const errors = validate(values);
            if (!isEmpty(errors)) {
              setErrors(errors);
              return;
            }

            setIsRegistering(true);

            const users = JSON.parse(localStorage.getItem('users')) || [];

            if (!userIsFound) {
              const newUser = {
                id: Math.floor(Math.random() * Date.now()),
                firstName: values.firstName,
                lastName: values.lastName,
                sex: values.sex.value,
                birthDate: dateFormat(values.birthDate, 'mm/dd/yyyy'),
                homeAddress: values.homeAddress,
                contactNumber: values.contactNumber,
                userType: values.userType.value,
                dateRegistered: Math.floor(Date.now() / 1000),
                gpsDevice: values.gpsDevice.value,
                timeIn: Math.floor(Date.now() / 1000),
                timeOut: null,
              };

              // Create new user
              localStorage.setItem(
                'users',
                JSON.stringify([...users, newUser])
              );
            } else {
              // Get the verified user so that we can update the time in
              const user = users.find(
                (u) =>
                  u.firstName.toLowerCase() ===
                    values.firstName.toLowerCase() &&
                  u.lastName.toLowerCase() === values.lastName.toLowerCase()
              );
              const updatedUser = {
                ...user,
                gpsDevice: values.gpsDevice.value,
                timeIn: Math.floor(Date.now() / 1000),
                timeOut: null,
              };
              const newUsers = [...users];
              newUsers.splice(users.indexOf(user), 1, updatedUser);
              localStorage.setItem('users', JSON.stringify(newUsers));
            }

            // Then, we remove the gpsDeviceOption in the state
            const gpsDeviceOptionIndex = gpsDevicesOptions.findIndex(
              (gpsDeviceOption) =>
                gpsDeviceOption.value === values.gpsDevice.value
            );

            const newGpsDevicesOptions = [...gpsDevicesOptions];
            if (gpsDeviceOptionIndex > -1) {
              newGpsDevicesOptions.splice(gpsDeviceOptionIndex, 1);
              setGpsDevicesOptions(newGpsDevicesOptions);
            }

            // Then we update the isAssigned of that gpsDevice in the localstorage
            const gpsDevices = JSON.parse(localStorage.getItem('gpsDevices'));
            const gpsDeviceIndex = gpsDevices.findIndex(
              (gpsDevice) => gpsDevice.id === values.gpsDevice.value
            );
            const newGpsDevices = [...gpsDevices];
            if (gpsDeviceOptionIndex > -1) {
              newGpsDevices[gpsDeviceIndex].isAssigned = true;
              localStorage.setItem('gpsDevices', JSON.stringify(newGpsDevices));
            }

            // Reset the form to its initial state
            setFieldValue('firstName', '');
            setFieldValue('lastName', '');
            setFieldValue('sex', {
              label: sexTypes.MALE,
              value: sexTypes.MALE,
            });
            setFieldValue('birthDate', '');
            setFieldValue('homeAddress', '');
            setFieldValue('contactNumber', '');
            setFieldValue('userType', {
              label: userTypes.VISITOR,
              value: userTypes.VISITOR,
            });
            setFieldValue('gpsDevice', {
              label: 'Select...',
              value: null,
            });

            // Then we reset the states
            setIsRegistering(false);
            setFirstName('');
            setLastName('');
            setUserIsFound(false);
          }}
        >
          {({ errors, values, handleSubmit, setFieldValue }) => (
            <form onSubmit={handleSubmit}>
              <Grid className={styles.Registration_withMargin}>
                <ControlledInput
                  name="firstName"
                  placeholder="First Name*"
                  icon="person"
                  value={values.firstName}
                  error={errors.firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setFieldValue('firstName', e.target.value);
                  }}
                />

                <ControlledInput
                  name="lastName"
                  placeholder="Last Name*"
                  icon="person"
                  value={values.lastName}
                  error={errors.lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setFieldValue('lastName', e.target.value);
                  }}
                />
              </Grid>

              {!userIsFound && (
                <>
                  <Grid className={styles.Registration_withMargin}>
                    <ControlledSelect
                      options={[
                        {
                          label: sexTypes.MALE,
                          value: sexTypes.MALE,
                        },
                        {
                          label: sexTypes.FEMALE,
                          value: sexTypes.FEMALE,
                        },
                      ]}
                      name="sex"
                      placeholder="Sex*"
                      value={values.sex}
                      error={errors.sex}
                      onChange={(val) =>
                        setFieldValue('sex', {
                          label: val.label,
                          value: val.value,
                        })
                      }
                    />

                    <DatePicker
                      dateFormat="MM/dd/yyyy"
                      selected={values.birthDate}
                      placeholder="Birth Date*"
                      name="birthDate"
                      icon="today"
                      error={errors.birthDate}
                      onChange={(date) => {
                        setFieldValue('birthDate', date);
                      }}
                    />
                  </Grid>

                  <ControlledInput
                    className={styles.Registration_withMargin}
                    name="homeAddress"
                    placeholder="Home Address*"
                    icon="home"
                    value={values.homeAddress}
                    error={errors.homeAddress}
                    onChange={(e) =>
                      setFieldValue('homeAddress', e.target.value)
                    }
                  />

                  <ControlledInput
                    className={styles.Registration_withMargin}
                    name="contactNumber"
                    placeholder="Contact Number*"
                    icon="phone"
                    value={values.contactNumber}
                    error={errors.contactNumber}
                    onChange={(e) =>
                      setFieldValue('contactNumber', e.target.value)
                    }
                  />

                  <ControlledSelect
                    className={styles.Registration_withMargin}
                    options={[
                      {
                        label: userTypes.PERSONNEL,
                        value: userTypes.PERSONNEL,
                      },
                      {
                        label: userTypes.VISITOR,
                        value: userTypes.VISITOR,
                      },
                    ]}
                    name="userType"
                    placeholder="User Type*"
                    value={values.userType}
                    error={errors.userType}
                    onChange={(val) =>
                      setFieldValue('userType', {
                        label: val.label,
                        value: val.value,
                      })
                    }
                  />
                </>
              )}

              <ControlledSelect
                className={styles.Registration_withMargin}
                // eslint-disable-next-line array-callback-return
                options={gpsDevicesOptions}
                name="gpsDevice"
                placeholder="GPS Device*"
                value={values.gpsDevice}
                error={errors.gpsDevice}
                onChange={(val) =>
                  setFieldValue('gpsDevice', {
                    label: val.label,
                    value: val.value,
                  })
                }
              />

              <div className={styles.Registration_buttonGroup}>
                <Button
                  className={styles.Registration_buttonGroup_button}
                  kind={buttonKinds.SUBMIT}
                  icon="add"
                  disabled={isRegistering}
                  onClick={() => {}}
                >
                  <span className={styles.Registration_buttonGroup_buttonText}>
                    Register User
                    {isRegistering && (
                      <Spinner
                        size={spinnerSizes.XS}
                        colorName={colorNames.WHITE}
                        className={styles.Registration_buttonGroup_spinner}
                      />
                    )}
                  </span>
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default Registration;
