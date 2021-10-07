import React from 'react';
import PropTypes from 'prop-types';
import Swal from 'react-bootstrap-sweetalert';
import styles from './styles.module.scss';

import { Button } from '../elements';
import { buttonTypes, sweetAlertTypes } from '../../globals';

const SweetAlert = ({
  show,
  type,
  title,
  children,
  confirmBtnText,
  cancelBtnText,
  onConfirm,
  onCancel,
}) => (
  <Swal
    show={show}
    type={type}
    title={title}
    customButtons={
      <>
        <Button
          type={buttonTypes.PRIMARY.RED}
          className={styles.SweetAlert_button}
          onClick={onCancel}
        >
          {cancelBtnText}
        </Button>
        <Button
          type={buttonTypes.PRIMARY.GREEN}
          className={styles.SweetAlert_button}
          onClick={onConfirm}
        >
          {confirmBtnText}
        </Button>
      </>
    }
    onConfirm={() => {}}
  >
    {children}
  </Swal>
);

SweetAlert.defaultProps = {
  show: false,
  type: sweetAlertTypes.WARNING,
  children: null,
  confirmBtnText: 'Yes',
  cancelBtnText: 'No',
  onCancel: () => {},
};

SweetAlert.propTypes = {
  show: PropTypes.bool,
  type: PropTypes.oneOf([
    sweetAlertTypes.INFO,
    sweetAlertTypes.SUCCESS,
    sweetAlertTypes.WARNING,
    sweetAlertTypes.DANGER,
    sweetAlertTypes.CONTROLLED,
  ]),
  title: PropTypes.string.isRequired,
  children: PropTypes.any,
  confirmBtnText: PropTypes.string,
  cancelBtnText: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
};

export default SweetAlert;
