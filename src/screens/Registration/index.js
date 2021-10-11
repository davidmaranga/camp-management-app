import React, { useRef, useState, useContext, useEffect } from 'react';
import { Formik } from 'formik';
import dateFormat from 'dateformat';
import { useAlert } from 'react-alert';
import QRCode from 'qrcode.react';
import isEmpty from 'lodash/isEmpty';
import PNPLogo from '../../static/images/pnp-logo.png';

import styles from './styles.module.scss';

import {
  Button,
  Checkbox,
  ControlledInput,
  ControlledSelect,
  Grid,
  DatePicker,
  Spinner,
  Text,
} from '../../components/elements';
import { ConsentFormModal } from '../../components/modals';
import { MapContext } from '../../contexts';
import {
  buttonKinds,
  colorNames,
  sexTypes,
  textTypes,
  spinnerSizes,
  userTypes,
} from '../../globals';
import { outerWrapperGeoJson } from '../Map/constants';
import { buildingsCoordinates } from '../Map/MapTabs/constants';
import { randomPointInPoly } from '../../utils/map';

const Registration = () => {
  const alert = useAlert();
  const overflowRef = useRef(null);
  const formRef = useRef(null);
  const {
    users,
    updateUsers,
    gpsDevices,
    updateGpsDevices,
    histories,
    updateHistories,
    userLocations,
    updateUserLocations,
    vehicleLocations,
    updateVehicleLocations,
  } = useContext(MapContext);
  const [isRegisteringUser, setIsRegisteringUser] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [foundUser, setFoundUser] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [gpsDevicesOptions, setGpsDevicesOptions] = useState([]);
  const [showConsentFormModal, setShowConsentFormModal] = useState(false);

  const validate = (values) => {
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

    if (!values.userGpsDevice.value && values.hasCellphone.value === 'No') {
      errors.userGpsDevice = 'This field is required.';
    }

    if (!values.hasVehicle.value) {
      errors.hasVehicle = 'This field is required.';
    }

    if (!values.plateNumber && values.hasVehicle.value === 'Yes') {
      errors.plateNumber = 'This field is required.';
    }

    if (!values.vehicleGpsDevice.value && values.hasVehicle.value === 'Yes') {
      errors.vehicleGpsDevice = 'This field is required.';
    }

    if (!values.color && values.hasVehicle.value === 'Yes') {
      errors.color = 'This field is required.';
    }

    if (!values.brand && values.hasVehicle.value === 'Yes') {
      errors.brand = 'This field is required.';
    }

    if (!values.model && values.hasVehicle.value === 'Yes') {
      errors.model = 'This field is required.';
    }

    if (!values.intendedOfficesToVisit) {
      errors.intendedOfficesToVisit = 'This field is required.';
    }

    if (!values.isSignedConsentForm) {
      errors.isSignedConsentForm = 'You must agree to this to proceed.';
    }

    return errors;
  };

  useEffect(() => {
    setFoundUser(
      users.find(
        (user) =>
          user.firstName.toLowerCase() === firstName.toLowerCase() &&
          user.lastName.toLowerCase() === lastName.toLowerCase()
      )
    );
  }, [firstName, lastName]);

  useEffect(() => {
    const options = [];

    gpsDevices.forEach((gpsDevice) => {
      if (!gpsDevice.userID) {
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
      <div className={styles.Registration_sidebar}>
        <img
          src={PNPLogo}
          alt="PNP Logo"
          className={styles.Registration_sidebar_logo}
        />
      </div>

      <div className={styles.Registration_container}>
        <div
          ref={overflowRef}
          className={styles.Registration_container_overflow}
        >
          <div className={styles.Registration_container_form}>
            <Text
              className={styles.Registration_container_form_title}
              type={textTypes.HEADING.XS}
            >
              User Registration Form
            </Text>

            <Formik
              innerRef={formRef}
              initialValues={{
                firstName: '',
                lastName: '',
                sex: {
                  label: sexTypes.MALE,
                  value: sexTypes.MALE,
                },
                birthDate: null,
                homeAddress: '',
                contactNumber: '',
                userType: {
                  label: userTypes.VISITOR,
                  value: userTypes.VISITOR,
                },
                hasCellphone: {
                  label: 'Yes',
                  value: 'Yes',
                },
                userGpsDevice: {
                  label: 'Select...',
                  value: null,
                },
                hasVehicle: {
                  label: 'No',
                  value: 'No',
                },
                plateNumber: '',
                color: '',
                brand: '',
                model: '',
                vehicleGpsDevice: {
                  label: 'Select...',
                  value: null,
                },
                intentedOfficesToVisit: null,
                isSignedConsentForm: false,
              }}
              onSubmit={async (values, { setErrors, setFieldValue }) => {
                const errors = validate(values);
                if (!isEmpty(errors)) {
                  setErrors(errors);
                  return;
                }

                setIsRegisteringUser(true);

                let id = Math.floor(Math.random() * Date.now()); // userId

                // Create new user
                if (!foundUser) {
                  const newUser = {
                    id,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    sex: values.sex.value,
                    birthDate: dateFormat(values.birthDate, 'mm/dd/yyyy'),
                    homeAddress: values.homeAddress,
                    contactNumber: values.contactNumber,
                    userType: values.userType.value,
                    dateRegistered: new Date(),
                  };

                  updateUsers([...users, newUser]);
                } else {
                  id = foundUser.id;
                }

                // Create user location
                const dummyUserPoint = randomPointInPoly(outerWrapperGeoJson);
                const newUserLocation = {
                  id: Math.floor(Math.random() * Date.now()),
                  userID: id,
                  type: foundUser ? foundUser.userType : values.userType.value,
                  latitude: dummyUserPoint.geometry.coordinates[1],
                  longitude: dummyUserPoint.geometry.coordinates[0],
                };

                updateUserLocations([...userLocations, newUserLocation]);

                // Create new history
                const intendedOfficesToVisit = [];
                values.intendedOfficesToVisit.forEach((office) => {
                  intendedOfficesToVisit.push(office.value);
                });

                const newHistory = {
                  userID: id,
                  date: new Date(),
                  timeIn: Math.floor(Date.now() / 1000),
                  timeOut: null,
                  userGpsDevice: values.userGpsDevice.value,
                  intendedOfficesToVisit,
                  officesVisited: [],
                };

                let gpsDevicesOptionsCopy = JSON.parse(
                  JSON.stringify(gpsDevicesOptions)
                );
                const gpsDevicesCopy = JSON.parse(JSON.stringify(gpsDevices));

                if (values.hasVehicle.value === 'Yes') {
                  // Create vehicle location
                  const dummyVehiclePoint =
                    randomPointInPoly(outerWrapperGeoJson);
                  const newVehicleLocation = {
                    id: Math.floor(Math.random() * Date.now()),
                    userID: id,
                    type: 'Vehicle',
                    latitude: dummyVehiclePoint.geometry.coordinates[1],
                    longitude: dummyVehiclePoint.geometry.coordinates[0],
                  };

                  updateVehicleLocations([
                    ...vehicleLocations,
                    newVehicleLocation,
                  ]);

                  // Add needed properties for vehicles in our newHistory object
                  newHistory.vehicleGpsDevice = values.vehicleGpsDevice.value;
                  newHistory.plateNumber = values.plateNumber;
                  newHistory.color = values.color;
                  newHistory.brand = values.brand;
                  newHistory.model = values.model;

                  // Then, we remove the gpsDeviceOption selected for
                  // vehicleGpsDevice in the state
                  const newGpsDevicesOptions = gpsDevicesOptionsCopy.filter(
                    (option) => option.value !== values.vehicleGpsDevice.value
                  );
                  gpsDevicesOptionsCopy = newGpsDevicesOptions;
                  setGpsDevicesOptions(newGpsDevicesOptions);

                  // Then we update the assignedID and type of that gpsDevice
                  // in the state and localstorage
                  const matchedGpsDevice = gpsDevicesCopy.find(
                    (device) => device.id === values.vehicleGpsDevice.value
                  );

                  matchedGpsDevice.userID = id;
                  matchedGpsDevice.type = 'Vehicle';

                  updateGpsDevices(gpsDevicesCopy);
                }

                updateHistories([...histories, newHistory]);

                // If the user doesn't have a cellphone, it means that
                // he/she must be given a gps deviced
                if (values.hasCellphone.value === 'No') {
                  // So, we remove the gpsDeviceOption selected for
                  // userGpsDevice in the state
                  const newGpsDevicesOptions = gpsDevicesOptionsCopy.filter(
                    (option) => option.value !== values.userGpsDevice.value
                  );
                  gpsDevicesOptionsCopy = newGpsDevicesOptions;
                  setGpsDevicesOptions(newGpsDevicesOptions);

                  // Then we update the assignedID and type of that gpsDevice
                  // in the state and localstorage
                  const matchedGpsDevice = gpsDevicesCopy.find(
                    (device) => device.id === values.userGpsDevice.value
                  );

                  matchedGpsDevice.userID = id;
                  matchedGpsDevice.type = 'User';

                  updateGpsDevices(gpsDevicesCopy);
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
                setFieldValue('birthDate', null);
                setFieldValue('homeAddress', '');
                setFieldValue('contactNumber', '');
                setFieldValue('userType', {
                  label: userTypes.VISITOR,
                  value: userTypes.VISITOR,
                });
                setFieldValue('hasCellphone', {
                  label: 'Yes',
                  value: 'Yes',
                });
                setFieldValue('userGpsDevice', {
                  label: 'Select...',
                  value: null,
                });
                setFieldValue('hasVehicle', {
                  label: 'No',
                  value: 'No',
                });
                setFieldValue('plateNumber', '');
                setFieldValue('color', '');
                setFieldValue('brand', '');
                setFieldValue('model', '');
                setFieldValue('vehicleGpsDevice', {
                  label: 'Select...',
                  value: null,
                });
                setFieldValue('intendedOfficesToVisit', null);

                // Then we reset the states
                setIsRegisteringUser(false);
                setFirstName('');
                setLastName('');
                setFoundUser(null);

                // Scroll to top
                overflowRef.current.scrollTo(0, 0);
              }}
            >
              {({ errors, values, setFieldValue }) => (
                <>
                  {qrCode && (
                    <div
                      className={
                        styles.Registration_container_form_qrCodeWrapper
                      }
                    >
                      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                      <QRCode {...qrCode} />
                      <button
                        type="button"
                        className={
                          styles.Registration_container_form_qrCodeWrapper_removeQrCode
                        }
                        onClick={() => setQrCode(null)}
                      >
                        Remove Qr Code
                      </button>
                    </div>
                  )}

                  <Grid
                    className={styles.Registration_container_form_withMargin}
                  >
                    <ControlledInput
                      name="firstName"
                      label="First Name*"
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
                      label="Last Name*"
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
                      <Grid
                        className={
                          styles.Registration_container_form_withMargin
                        }
                      >
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
                          label="Sex*"
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
                          label="Birth Date*"
                          name="birthDate"
                          icon="today"
                          error={errors.birthDate}
                          onChange={(date) => {
                            setFieldValue('birthDate', date);
                          }}
                        />
                      </Grid>

                      <ControlledInput
                        className={
                          styles.Registration_container_form_withMargin
                        }
                        name="homeAddress"
                        label="Home Address*"
                        icon="home"
                        value={values.homeAddress}
                        error={errors.homeAddress}
                        onChange={(e) =>
                          setFieldValue('homeAddress', e.target.value)
                        }
                      />

                      <ControlledInput
                        className={
                          styles.Registration_container_form_withMargin
                        }
                        name="contactNumber"
                        label="Contact Number*"
                        icon="phone"
                        value={values.contactNumber}
                        error={errors.contactNumber}
                        onChange={(e) =>
                          setFieldValue('contactNumber', e.target.value)
                        }
                      />

                      <ControlledSelect
                        className={
                          styles.Registration_container_form_withMargin
                        }
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
                        label="User Type*"
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
                    className={styles.Registration_container_form_withMargin}
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
                    label="Has Cellphone?*"
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
                      className={styles.Registration_container_form_withMargin}
                      options={gpsDevicesOptions}
                      name="userGpsDevice"
                      label="User GPS Device*"
                      value={values.userGpsDevice}
                      error={errors.userGpsDevice}
                      onChange={(val) =>
                        setFieldValue('userGpsDevice', {
                          label: val.label,
                          value: val.value,
                        })
                      }
                    />
                  )}

                  <ControlledSelect
                    className={styles.Registration_container_form_withMargin}
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
                    name="hasVehicle"
                    label="Has Vehicle?*"
                    value={values.hasVehicle}
                    error={errors.hasVehicle}
                    onChange={(val) =>
                      setFieldValue('hasVehicle', {
                        label: val.label,
                        value: val.value,
                      })
                    }
                  />

                  {values.hasVehicle.value === 'Yes' && (
                    <>
                      <Grid
                        className={
                          styles.Registration_container_form_withMargin
                        }
                      >
                        <ControlledInput
                          name="plateNumber"
                          label="Plate Number*"
                          icon="pin"
                          value={values.plateNumber}
                          error={errors.plateNumber}
                          onChange={(e) =>
                            setFieldValue('plateNumber', e.target.value)
                          }
                        />

                        <ControlledInput
                          name="color"
                          label="Color*"
                          icon="palette"
                          value={values.color}
                          error={errors.color}
                          onChange={(e) => {
                            setFieldValue('color', e.target.value);
                          }}
                        />
                      </Grid>

                      <Grid
                        className={
                          styles.Registration_container_form_withMargin
                        }
                      >
                        <ControlledInput
                          name="brand"
                          label="Brand*"
                          icon="branding_watermark"
                          value={values.brand}
                          error={errors.brand}
                          onChange={(e) => {
                            setFieldValue('brand', e.target.value);
                          }}
                        />

                        <ControlledInput
                          name="model"
                          label="Model*"
                          icon="model_training"
                          value={values.model}
                          error={errors.model}
                          onChange={(e) => {
                            setFieldValue('model', e.target.value);
                          }}
                        />
                      </Grid>

                      <ControlledSelect
                        className={
                          styles.Registration_container_form_withMargin
                        }
                        options={gpsDevicesOptions}
                        name="vehicleGpsDevice"
                        label="Vehicle GPS Device*"
                        value={values.vehicleGpsDevice}
                        error={errors.vehicleGpsDevice}
                        onChange={(val) =>
                          setFieldValue('vehicleGpsDevice', {
                            label: val.label,
                            value: val.value,
                          })
                        }
                      />
                    </>
                  )}

                  <ControlledSelect
                    isMulti
                    className={styles.Registration_container_form_withMargin}
                    options={buildingsCoordinates.map((building) => ({
                      value: building.name,
                      label: building.name,
                    }))}
                    name="intendedOfficesToVisit"
                    label="Intended Offices to Visit*"
                    value={values.intendedOfficesToVisit}
                    error={errors.intendedOfficesToVisit}
                    onChange={(val) =>
                      setFieldValue('intendedOfficesToVisit', val)
                    }
                  />

                  <Checkbox
                    labelClassName={styles.Registration_container_form_checkbox}
                    name="isSignedConsentForm"
                    onChange={() =>
                      setFieldValue(
                        'isSignedConsentForm',
                        !values.isSignedConsentForm
                      )
                    }
                    error={errors.isSignedConsentForm}
                    checked={values.isSignedConsentForm}
                  >
                    <Text>I agree to the terms and conditions stated</Text>
                    <Button
                      className={
                        styles.Registration_container_form_checkboxButton
                      }
                      onClick={() => setShowConsentFormModal(true)}
                    >
                      here
                    </Button>
                    .
                  </Checkbox>

                  <ConsentFormModal
                    isOpen={showConsentFormModal}
                    handleClose={() => setShowConsentFormModal(false)}
                  />
                </>
              )}
            </Formik>
          </div>
        </div>

        <div className={styles.Registration_container_footer}>
          <div className={styles.Registration_container_footer_wrapper}>
            <Button
              className={styles.Registration_container_footer_button}
              kind={buttonKinds.SUBMIT}
              icon="add"
              disabled={isRegisteringUser}
              onClick={() => formRef.current.handleSubmit()}
            >
              <span className={styles.Registration_container_footer_buttonText}>
                Register User
                {isRegisteringUser && (
                  <Spinner
                    size={spinnerSizes.XS}
                    colorName={colorNames.WHITE}
                    className={styles.Registration_container_footer_spinner}
                  />
                )}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
