import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from 'react-icons/fa';
import styles from './Pagination.module.sass';

const Pagination = ({ page, totalPages, onChange }) => (
  <div className={styles.pagination}>
    <button
      className={styles.navBtn}
      onClick={() => onChange(page - 1)}
      disabled={page === 1}
    >
      <FaArrowAltCircleLeft className={styles.arrowBtn} />
    </button>
    <p className={styles.numPage}>
      Page {page} of {totalPages}
    </p>
    <button
      className={styles.navBtn}
      onClick={() => onChange(page + 1)}
      disabled={page === totalPages}
    >
      <FaArrowAltCircleRight className={styles.arrowBtn} />
    </button>
  </div>
);

export default Pagination;
