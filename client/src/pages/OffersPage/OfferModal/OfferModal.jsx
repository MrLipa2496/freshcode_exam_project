import React from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import styles from './OfferModal.module.sass';

const OfferModal = ({ onClose, onConfirm }) => (
  <div className={styles.modal}>
    <div className={styles.modalContent}>
      <h2 className={styles.modalTitle}>Update Offer Status</h2>
      <div className={styles.modalActions}>
        <button
          className={styles.approveButton}
          onClick={() => onConfirm('approved_by_moderator')}
        >
          Approve
        </button>
        <button
          className={styles.rejectButton}
          onClick={() => onConfirm('rejected')}
        >
          Reject
        </button>
        <MdOutlineCancel onClick={onClose} className={styles.cancelBtn} />
      </div>
    </div>
  </div>
);

export default OfferModal;
