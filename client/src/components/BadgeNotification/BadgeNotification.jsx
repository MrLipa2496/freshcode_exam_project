import styles from './BadgeNotification.module.sass';

function BadgeNotification ({ count }) {
  if (count <= 0) return null;
  return <div className={styles.badge}>{count}</div>;
}

export default BadgeNotification;
