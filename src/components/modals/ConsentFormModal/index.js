import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Text } from '../../elements';

const ConsentFormModal = ({ isOpen, handleClose }) => (
  <Modal isOpen={isOpen} handleClose={handleClose} title="Consent Form">
    <Text>
      The Philippine National Police has declared a new way of camp management.
      In consideration of going inside the camp, the undersigned acknowledge and
      agree to the following:
      <ol>
        <li>
          My full name, age, home address, phone number shall be collected by
          the PNP for the purpose of covid tracking, in case of a reported case
          within the camp.
        </li>
        <li>
          My movements within the camp shall be tracked for safety purposes in
          order to prevent entries within off limits sites, or possible threats.
        </li>
      </ol>
      <Text>
        By agreeing, I acknowledge that I have read the foregoing Consent form
        and understand its contents; that I am at least eighteen (18) years old
        and fully competent to give my consent; That I have been sufficiently
        informed of the risks involved and give my voluntary consent in signing
        it as my own free act and deed; that I give my voluntary consent in
        signing this consent as my own free act and deed with full intention to
        be bound by the same, and free from any inducement or representation.
      </Text>
    </Text>
  </Modal>
);

ConsentFormModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default ConsentFormModal;
