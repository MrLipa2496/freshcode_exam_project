import React from 'react';
import styles from './OptionButton.module.sass';

function OptionButton ({ option, isSelected, onClick }) {
  const handleClick = () => {
    onClick(option.id);
  };

  return (
    <div
      className={`${styles.option} ${isSelected ? styles.selected : ''}`}
      onClick={handleClick}
    >
      <div className={styles.optionHeader}>
        <span className={styles.optionLabel}>{option.label}</span>
        {option.recommended && (
          <span className={styles.recommended}>Recommended</span>
        )}
      </div>
      <p className={styles.optionDescription}>{option.description}</p>
    </div>
  );
}

export default OptionButton;
