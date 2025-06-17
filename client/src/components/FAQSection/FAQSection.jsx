import { useState, useRef } from 'react';
import { CiSearch } from 'react-icons/ci';
import styles from './FAQSection.module.sass';
import CONSTANTS from '../../constants';
function FAQItem ({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className={`${styles.faqItem} ${isOpen ? styles.faqItemActive : ''}`}>
      <button
        className={`${styles.faqQuestion} ${
          isOpen ? styles.faqQuestionActive : ''
        }`}
        onClick={handleToggle}
      >
        {question}{' '}
        <span
          className={`${styles.faqQuestionIcon} ${
            isOpen ? styles.faqIconActive : ''
          }`}
        >
          {isOpen ? '−' : '+'}
        </span>
      </button>
      {isOpen && <div className={styles.faqAnswer}>{answer}</div>}
    </div>
  );
}

function FAQSection () {
  const [activeTab, setActiveTab] = useState('launching');
  const sectionsRef = Object.keys(CONSTANTS.FAQ_DATA).reduce((acc, key) => {
    acc[key] = useRef(null);
    return acc;
  }, {});

  const handleTabClick = key => {
    setActiveTab(key);
    sectionsRef[key].current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const renderTabs = () =>
    Object.keys(CONSTANTS.FAQ_DATA).map((key, index) => (
      <button
        key={index}
        className={`${styles.faqTabButton} ${
          activeTab === key ? styles.faqTabButtonActive : ''
        }`}
        onClick={() => handleTabClick(key)}
      >
        {CONSTANTS.FAQ_DATA[key].title}
      </button>
    ));

  const renderSections = () =>
    Object.entries(CONSTANTS.FAQ_DATA).map(([key, section]) => (
      <div key={key} ref={sectionsRef[key]} className={styles.faqSection}>
        <h3 className={styles.faqTitle}>{section.title}</h3>
        {section.questions.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    ));

  const renderTags = () =>
    CONSTANTS.FAQ_SEARCH_TAGS.map((tag, index) => (
      <a key={index} className={styles.tag}>
        {tag}
      </a>
    ));

  return (
    <div className={styles.faqContainer}>
      <div className={styles.faqTabs}>{renderTabs()}</div>
      {renderSections()}
      <div className={styles.inputWrapper}>
        <input
          className={styles.faqInput}
          type='text'
          placeholder='Search Over 200,000+ Premium Names'
        />
        <div className={styles.searchIconWrapper}>
          <CiSearch className={styles.searchIcon} />
        </div>
      </div>
      <div className={styles.tagsContainer}>{renderTags()}</div>
    </div>
  );
}

export default FAQSection;
