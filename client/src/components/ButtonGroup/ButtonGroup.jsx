import React, { useState, useCallback } from 'react';
import styles from './ButtonGroup.module.sass';
import CONSTANTS from '../../constants';
import OptionButton from './OptionButton/OptionButton';

function ButtonGroup () {
  const [selectedOption, setSelectedOption] = useState('YesWithVariations');

  const handleOptionChange = useCallback(id => {
    setSelectedOption(id);
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        Do you want a matching domain (.com URL) with your name?
      </h2>
      <div className={styles.btnContainer}>
        {CONSTANTS.BTN_GROUP_OPTIONS.map(option => (
          <OptionButton
            key={option.id}
            option={option}
            isSelected={selectedOption === option.id}
            onClick={handleOptionChange}
          />
        ))}
      </div>
      <p className={styles.note}>
        If you want a matching domain, our platform will only accept those name
        suggestions where the domain is available.
      </p>
    </div>
  );
}

export default ButtonGroup;
