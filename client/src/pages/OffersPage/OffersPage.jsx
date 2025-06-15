import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import classNames from 'classnames';
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from 'react-icons/fa';
import {
  getPendingOffers,
  updateOfferStatus,
} from '../../api/rest/restController';
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

  const formik = useFormik({
    initialValues: { status: '' },
    onSubmit: async values => {
      if (!selectedOffer || !selectedOffer.id) {
        alert('Offer ID is missing');
        return;
      }
      try {
        await updateOfferStatus(selectedOffer.id, { status: values.status });
        await fetchOffers();
        setModalOpen(false);
      } catch (error) {}
    },
  });

  const handleEdit = offer => {
    if (!offer || !offer.id) {
      alert('Invalid offer');
      return;
    }
    setSelectedOffer(offer);
    setModalOpen(true);
    formik.setValues({ status: offer.status });
  };

  return (
    <div className={styles.offersPage}>
      <h1 className={styles.title}>Offers Pending Moderation</h1>
      {loading ? (
        <div className={styles.spinner}>Loading...</div>
      ) : (
        <>
          <div className={styles.offersTableContainer}>
            <table className={styles.offersTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User ID</th>
                  <th>Contest ID</th>
                  <th>Text</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {offers.map(offer => (
                  <tr
                    key={offer.id}
                    className={classNames({
                      [styles.pending]: offer.status === 'pending',
                    })}
                  >
                    <td>{offer.id}</td>
                    <td>{offer.userId}</td>
                    <td>{offer.contestId}</td>
                    <td>{offer.text}</td>
                    <td>{offer.status}</td>
                    <td>
                      <button
                        className={styles.editBtn}
                        onClick={() => handleEdit(offer)}
                      >
                        Change status
                      </button>
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
      {modalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Update offer status</h2>
            <form onSubmit={formik.handleSubmit}>
              <select
                name='status'
                value={formik.values.status}
                onChange={formik.handleChange}
                className={styles.statusSelect}
              >
                <option value='pending'>-</option>
                <option value='approved_by_moderator'>
                  Approved by Moderator
                </option>
                <option value='rejected'>Rejected by Moderator</option>
              </select>
              <div className={styles.modalActions}>
                <button type='submit' className={styles.submitBtn}>
                  Save
                </button>
                <button
                  type='button'
                  className={styles.cancelBtn}
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OffersPage;
