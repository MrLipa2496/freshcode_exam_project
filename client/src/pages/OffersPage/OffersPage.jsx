import { useEffect, useState } from 'react';
import {
  getPendingOffers,
  updateOfferStatus,
} from '../../api/rest/restController';
import OfferTable from './OfferTable/OfferTable';
import OfferModal from './OfferModal/OfferModal';
import Pagination from './../../components/Pagination/Pagination';
import styles from './OffersPage.module.sass';

const pageSize = 5;

const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = offer => {
    setSelectedOffer(offer);
    setModalOpen(true);
  };

  const handleStatusChange = async status => {
    try {
      await updateOfferStatus(selectedOffer.id, { status });
      await fetchOffers();
      setModalOpen(false);
    } catch {
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
          <OfferTable offers={offers} onEdit={handleEdit} />
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
      {modalOpen && selectedOffer && (
        <OfferModal
          onClose={() => setModalOpen(false)}
          onConfirm={handleStatusChange}
        />
      )}
    </div>
  );
};

export default OffersPage;
