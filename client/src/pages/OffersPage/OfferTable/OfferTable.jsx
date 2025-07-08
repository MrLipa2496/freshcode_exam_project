import React from 'react';
import classNames from 'classnames';
import CONSTANTS from './../../../constants';
import styles from './OfferTable.module.sass';

const OfferTable = ({ offers, onEdit }) => (
  <div className={styles.offersTableContainer}>
    <table className={styles.offersTable}>
      <thead>
        <tr>
          <th>Contest Name</th>
          <th>Contest Type</th>
          <th>Offer Text</th>
          <th>File</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {offers.map((offer, index) => (
          <tr
            key={index}
            className={classNames({
              [styles.pending]: offer.status === 'pending',
              [styles.approved]: offer.status === 'approved_by_moderator',
              [styles.rejected]: offer.status === 'rejected',
              [styles.won]: offer.status === 'won',
            })}
          >
            <td>{offer.contest?.name || '—'}</td>
            <td>{offer.contest?.type || '—'}</td>
            <td>{offer.text || '—'}</td>
            <td>
              {offer.fileName ? (
                <a
                  href={`${CONSTANTS.publicURL}${offer.fileName}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={styles.fileLink}
                >
                  View File
                </a>
              ) : (
                '—'
              )}
            </td>
            <td>{offer.status}</td>
            <td>
              {{
                rejected: (
                  <span className={styles.rejectedByByer}>Buyer rejected</span>
                ),
                won: (
                  <span className={styles.approvedByByer}>Buyer approved</span>
                ),
              }[offer.status] || (
                <button
                  className={styles.editBtn}
                  onClick={() => onEdit(offer)}
                >
                  Change status
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default OfferTable;
