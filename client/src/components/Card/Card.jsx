import React from 'react';
import classNames from 'classnames';
import { FaArrowRightLong } from 'react-icons/fa6';
import styles from './Card.module.sass';

const Card = ({
  logo,
  title,
  description,
  buttonText,
  variant = 'default',
  isLastStep = false,
}) => {
  const cardClass = classNames(styles.card, {
    [styles.stepsCard]: variant === 'steps',
  });

  const titleClass = classNames(styles.title, {
    [styles.stepsTitle]: variant === 'steps',
  });

  return (
    <div className={cardClass}>
      {logo && (
        <div className={styles.logoContainer}>
          <img src={logo} alt='logo' />
        </div>
      )}
      {title && <h2 className={titleClass}>{title}</h2>}
      {description && <p className={styles.description}>{description}</p>}
      {variant === 'steps' && !isLastStep && (
        <FaArrowRightLong className={styles.arrow} />
      )}
      {buttonText && (
        <button className={styles.button}>
          {buttonText} <FaArrowRightLong className={styles.btnArrow} />
        </button>
      )}
    </div>
  );
};

export default Card;
