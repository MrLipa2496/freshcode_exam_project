import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from 'react-icons/fa';
import { MdOutlineCancel } from 'react-icons/md';
import {
  getPendingOffers,
  updateOfferStatus,
} from '../../api/rest/restController';
import CONSTANTS from './../../constants';
import styles from './OffersPage.module.sass';

const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    fetchOffers();
  }, [page]);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const response = await getPendingOffers({ page, pageSize });
      setOffers(response.data.offers || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      alert('Failed to load offers');
    }
    setLoading(false);
  };

  const handleEdit = offer => {
    if (!offer || !offer.id) {
      alert('Invalid offer');
      return;
    }
    setSelectedOffer(offer);
    setModalOpen(true);
  };

  const handleStatusChange = async newStatus => {
    if (!selectedOffer || !selectedOffer.id) return;
    try {
      await updateOfferStatus(selectedOffer.id, { status: newStatus });
      await fetchOffers();
      setModalOpen(false);
    } catch (error) {
      alert('Failed to update status');
    }
  };

  return (
    <div className={styles.offersPage}>
      <h1 className={styles.title}>Offers Moderation</h1>
      {loading ? (
        <div className={styles.spinner}>Loading...</div>
      ) : (
        <>
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
                      [styles.approved]:
                        offer.status === 'approved_by_moderator',
                      [styles.rejected]: offer.status === 'rejected',
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
                          <span className={styles.rejectedByByer}>
                            Buyer rejected
                          </span>
                        ),
                        won: (
                          <span className={styles.approvedByByer}>
                            Buyer approved
                          </span>
                        ),
                      }[offer.status] || (
                        <button
                          className={styles.editBtn}
                          onClick={() => handleEdit(offer)}
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
          <div className={styles.pagination}>
            <button
              className={styles.navBtn}
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              <FaArrowAltCircleLeft className={styles.arrowBtn} />
            </button>
            <p className={styles.numPage}>
              Page {page} of {totalPages}
            </p>
            <button
              className={styles.navBtn}
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              <FaArrowAltCircleRight className={styles.arrowBtn} />
            </button>
          </div>
        </>
      )}
      {modalOpen && selectedOffer && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Update Offer Status</h2>
            <div className={styles.modalActions}>
              <button
                className={styles.approveButton}
                onClick={() => handleStatusChange('approved_by_moderator')}
              >
                Approve
              </button>
              <button
                className={styles.rejectButton}
                onClick={() => handleStatusChange('rejected')}
              >
                Reject
              </button>
              <MdOutlineCancel
                onClick={() => setModalOpen(false)}
                className={styles.cancelBtn}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OffersPage;
