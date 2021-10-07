/* eslint-disable no-unreachable */
import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import dateFormat from 'dateformat';
import { useAlert } from 'react-alert';
import QRCode from 'qrcode.react';
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
  const alert = useAlert();
  const [isRegisteringUser, setIsRegisteringUser] = useState(false);
  const [isRegisteringVehicle, setIsRegisteringVehicle] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [foundUser, setFoundUser] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [plateNumber, setPlateNumber] = useState('');
  const [foundVehicle, setFoundVehicle] = useState(null);
  const [gpsDevicesOptions, setGpsDevicesOptions] = useState([]);

  const validateUser = (values) => {
    const errors = {};

    if (!values.firstName) {
      errors.firstName = 'This field is required.';
    }

    if (!values.lastName) {
      errors.lastName = 'This field is required.';
    }

    if (!values.sex.value && !foundUser) {
      errors.sex = 'This field is required.';
    }

    if (!values.birthDate && !foundUser) {
      errors.birthDate = 'This field is required.';
    }

    if (!values.homeAddress && !foundUser) {
      errors.homeAddress = 'This field is required.';
    }

    if (!values.contactNumber && !foundUser) {
      errors.contactNumber = 'This field is required.';
    }

    if (!values.userType.value && !foundUser) {
      errors.userType = 'This field is required.';
    }

    if (!values.hasCellphone.value) {
      errors.hasCellphone = 'This field is required.';
    }

    if (!values.gpsDevice.value && values.hasCellphone.value === 'No') {
      errors.gpsDevice = 'This field is required.';
    }

    return errors;
  };

  const validateVehicle = (values) => {
    const errors = {};

    if (!values.userID.value) {
      errors.userID = 'This field is required.';
    }

    if (!values.plateNumber) {
      errors.plateNumber = 'This field is required.';
    }

    if (!values.color && !foundVehicle) {
      errors.color = 'This field is required.';
    }

    if (!values.brand && !foundVehicle) {
      errors.brand = 'This field is required.';
    }

    if (!values.model && !foundVehicle) {
      errors.model = 'This field is required.';
    }

    return errors;
  };

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    setFoundUser(
      users.find(
        (user) =>
          user.firstName.toLowerCase() === firstName.toLowerCase() &&
          user.lastName.toLowerCase() === lastName.toLowerCase()
      )
    );
  }, [firstName, lastName]);

  useEffect(() => {
    const vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
    setFoundVehicle(
      vehicles.find(
        (vehicle) =>
          vehicle.plateNumber.toLowerCase() === plateNumber.toLowerCase()
      )
    );
  }, [plateNumber]);

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
      <Grid>
        <Card className={styles.Registration_card}>
          <Text
            type={textTypes.HEADING.XS}
            className={styles.Registration_title}
          >
            User Registration Form
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
              hasCellphone: {
                label: 'No',
                value: 'No',
              },
              gpsDevice: {
                label: 'Select...',
                value: null,
              },
            }}
            onSubmit={async (values, { setErrors, setFieldValue }) => {
              const errors = validateUser(values);
              if (!isEmpty(errors)) {
                setErrors(errors);
                return;
              }

              setIsRegisteringUser(true);

              let id = Math.floor(Math.random() * Date.now()); // userId

              // Create new user
              if (!foundUser) {
                const users = JSON.parse(localStorage.getItem('users')) || [];

                const newUser = {
                  id,
                  firstName: values.firstName,
                  lastName: values.lastName,
                  sex: values.sex.value,
                  birthDate: dateFormat(values.birthDate, 'mm/dd/yyyy'),
                  homeAddress: values.homeAddress,
                  contactNumber: values.contactNumber,
                  userType: values.userType.value,
                  dateRegistered: Math.floor(Date.now() / 1000),
                };

                localStorage.setItem(
                  'users',
                  JSON.stringify([...users, newUser])
                );
              }

              if (values.hasCellphone.value === 'No') {
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

                // Then we update the assignedID and type of that gpsDevice in the localstorage
                if (foundUser) {
                  id = foundUser.id;
                }

                const gpsDevices = JSON.parse(
                  localStorage.getItem('gpsDevices')
                );
                const gpsDeviceIndex = gpsDevices.findIndex(
                  (gpsDevice) => gpsDevice.id === values.gpsDevice.value
                );
                const newGpsDevices = [...gpsDevices];
                if (gpsDeviceOptionIndex > -1) {
                  newGpsDevices[gpsDeviceIndex].assignedID = id;
                  newGpsDevices[gpsDeviceIndex].type = 'User';
                  localStorage.setItem(
                    'gpsDevices',
                    JSON.stringify(newGpsDevices)
                  );
                }
              } else {
                // Show a qr code for scanning
                setQrCode({ value: 'http://facebook.github.io/react/' });
              }

              // Show a success alert
              alert.success('User Registered');

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
              setFieldValue('hasCellphone', {
                label: 'No',
                value: 'No',
              });
              setFieldValue('gpsDevice', {
                label: 'Select...',
                value: null,
              });

              // Then we reset the states
              setIsRegisteringUser(false);
              setFirstName('');
              setLastName('');
              setFoundUser(null);
            }}
          >
            {({ errors, values, handleSubmit, setFieldValue }) => (
              <form onSubmit={handleSubmit}>
                {qrCode && (
                  <div className={styles.Registration_qrCodeWrapper}>
                    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                    <QRCode {...qrCode} />
                    <button
                      type="button"
                      className={styles.Registration_qrCodeWrapper_removeQrCode}
                      onClick={() => setQrCode(null)}
                    >
                      Remove Qr Code
                    </button>
                  </div>
                )}

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
                {!foundUser && (
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
                  options={[
                    {
                      label: 'Yes',
                      value: 'Yes',
                    },
                    {
                      label: 'No',
                      value: 'No',
                    },
                  ]}
                  name="hasCellphone"
                  placeholder="Has Cellphone?*"
                  value={values.hasCellphone}
                  error={errors.hasCellphone}
                  onChange={(val) =>
                    setFieldValue('hasCellphone', {
                      label: val.label,
                      value: val.value,
                    })
                  }
                />
                {values.hasCellphone.value === 'No' && (
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
                )}
                <div className={styles.Registration_buttonGroup}>
                  <Button
                    className={styles.Registration_buttonGroup_button}
                    kind={buttonKinds.SUBMIT}
                    icon="add"
                    disabled={isRegisteringUser}
                    onClick={() => {}}
                  >
                    <span
                      className={styles.Registration_buttonGroup_buttonText}
                    >
                      {/* eslint-disable-next-line no-nested-ternary */}
                      {foundUser
                        ? values.hasCellphone.value === 'No'
                          ? 'Assign GPS Device'
                          : 'Generate QR Code'
                        : 'Register User'}
                      {isRegisteringUser && (
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

        <Card className={styles.Registration_card}>
          <Text
            type={textTypes.HEADING.XS}
            className={styles.Registration_title}
          >
            Vehicle Registration Form
          </Text>

          <Formik
            initialValues={{
              userID: {
                label: 'Select...',
                value: null,
              },
              plateNumber: '',
              color: '',
              brand: '',
              model: '',
              gpsDevice: {
                label: 'Select...',
                value: null,
              },
            }}
            onSubmit={async (values, { setErrors, setFieldValue }) => {
              const errors = validateVehicle(values);
              if (!isEmpty(errors)) {
                setErrors(errors);
                return;
              }

              setIsRegisteringVehicle(true);

              const vehicles =
                JSON.parse(localStorage.getItem('vehicles')) || [];
              if (!foundVehicle) {
                const newVehicle = {
                  id: Math.floor(Math.random() * Date.now()),
                  userID: values.userID.value,
                  plateNumber: values.plateNumber,
                  brand: values.brand,
                  model: values.model,
                  color: values.color,
                };

                // Create new vehicle
                localStorage.setItem(
                  'vehicles',
                  JSON.stringify([...vehicles, newVehicle])
                );
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

              // Show a success alert
              alert.success('Vehicle Registered');

              // Reset the form to its initial state
              setFieldValue('userID', {
                label: 'Select...',
                value: null,
              });
              setFieldValue('plateNumber', '');
              setFieldValue('color', '');
              setFieldValue('brand', '');
              setFieldValue('model', '');
              setFieldValue('gpsDevice', {
                label: 'Select...',
                value: null,
              });

              // Then we reset the states
              setIsRegisteringVehicle(false);
              setPlateNumber('');
              setFoundVehicle(null);
            }}
          >
            {({ errors, values, handleSubmit, setFieldValue }) => (
              <form onSubmit={handleSubmit}>
                <ControlledSelect
                  className={styles.Registration_withMargin}
                  options={JSON.parse(localStorage.getItem('users')).map(
                    (u) => ({
                      label: `${u.firstName} ${u.lastName}`,
                      value: u.id,
                    })
                  )}
                  name="userID"
                  placeholder="Select a User*"
                  value={values.userID}
                  error={errors.userID}
                  onChange={(val) =>
                    setFieldValue('userID', {
                      label: val.label,
                      value: val.value,
                    })
                  }
                />

                <ControlledInput
                  className={styles.Registration_withMargin}
                  name="plateNumber"
                  placeholder="Plate Number*"
                  icon="pin"
                  value={values.plateNumber}
                  error={errors.plateNumber}
                  onChange={(e) => {
                    setPlateNumber(e.target.value);
                    setFieldValue('plateNumber', e.target.value);
                  }}
                />

                {!foundVehicle && (
                  <>
                    <ControlledInput
                      className={styles.Registration_withMargin}
                      name="color"
                      placeholder="Color*"
                      icon="palette"
                      value={values.color}
                      error={errors.color}
                      onChange={(e) => {
                        setFieldValue('color', e.target.value);
                      }}
                    />

                    <ControlledInput
                      className={styles.Registration_withMargin}
                      name="brand"
                      placeholder="Brand*"
                      icon="branding_watermark"
                      value={values.brand}
                      error={errors.brand}
                      onChange={(e) => {
                        setFieldValue('brand', e.target.value);
                      }}
                    />

                    <ControlledInput
                      className={styles.Registration_withMargin}
                      name="model"
                      placeholder="Model*"
                      icon="model_training"
                      value={values.model}
                      error={errors.model}
                      onChange={(e) => {
                        setFieldValue('model', e.target.value);
                      }}
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
                    disabled={isRegisteringVehicle}
                    onClick={() => {}}
                  >
                    <span
                      className={styles.Registration_buttonGroup_buttonText}
                    >
                      Register Vehicle
                      {isRegisteringVehicle && (
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
      </Grid>
    </div>
  );
};

export default Registration;
