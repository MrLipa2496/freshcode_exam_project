import React, { useState } from 'react';
import styles from './ButtonGroup.module.sass';
import CONSTANTS from '../../constants';

function ButtonGroup () {
  const [selectedOption, setSelectedOption] = useState('YesWithVariations');

  const handleOptionChange = id => {
    setSelectedOption(id);
  };

  return (
    <>
      <div className={styles.container}>
        <h2 className={styles.title}>
          Do you want a matching domain (.com URL) with your name?
        </h2>
        <div className={styles.btnContainer}>
          {CONSTANTS.BTN_GROUP_OPTIONS.map(option => (
            <div
              key={option.id}
              className={`${styles.option} ${
                selectedOption === option.id ? styles.selected : ''
              }`}
              onClick={() => handleOptionChange(option.id)}
            >
              <div className={styles.optionHeader}>
                <span className={styles.optionLabel}>{option.label}</span>
                {option.recommended && (
                  <span className={styles.recommended}>Recommended</span>
                )}
              </div>
              <p className={styles.optionDescription}>{option.description}</p>
            </div>
          ))}
        </div>
        <p className={styles.note}>
          If you want a matching domain, our platform will only accept those
          name suggestions where the domain is available.
        </p>
      </div>
    </>
  );
}

export default ButtonGroup;
