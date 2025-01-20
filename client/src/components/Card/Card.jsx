import React from 'react';
import styles from './Card.module.sass';

const Card = ({ logo, title, description, buttonText, onButtonClick }) => {
  return (
    <div className={styles.card}>
      <div className={styles.logoContainer}>
        <img src={logo} alt='logo' />
      </div>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      <button className={styles.button} onClick={onButtonClick}>
        {buttonText}
      </button>
    </div>
  );
};

export default Card;
