import React from 'react';
import styles from './HowItWorks.module.sass';
import CONSTANTS from './../../constants';
import Card from '../../components/Card/Card';

function HowItWorks () {
  return (
    <>
      <div className={styles.wrapper}>
        <section className={styles.namingPlatform}>
          <div className={styles.namingPlatformInfo}>
            <p className={styles.subTitle}>World's #1 Naming Platform</p>
            <h1 className={styles.title}>How Does Atom Work?</h1>
            <p className={styles.npContent}>
              Atom helps you come up with a great name for your business by
              combining the power of crowdsourcing with sophisticated technology
              and Agency-level validation services.
            </p>
          </div>
          <div className={styles.imgContainer}>
            <img
              className={styles.videoPoster}
              src={`${CONSTANTS.STATIC_IMAGES_PATH}how-it-works-video-poster.png`}
              alt='Poster'
            />
          </div>
        </section>

        <section className={styles.services}>
          <p className={styles.subTitle}>Our Services</p>
          <h2 className={styles.useTitle}>3 Ways To Use Atom</h2>
          <p className={styles.servicesInfo}>
            Atom offers 3 ways to get you a perfect name for your business.
          </p>
          <div className={styles.cardsContainer}>
            {CONSTANTS.CARDS_DATA.map((card, index) => (
              <Card
                key={index}
                logo={card.logo}
                title={card.title}
                description={card.description}
                buttonText={card.buttonText}
              />
            ))}
          </div>
        </section>

        <section className={styles.steps}>
          <div className={styles.imgWrapper}>
            <img
              className={styles.cupImg}
              src={`${CONSTANTS.STATIC_IMAGES_PATH}/svg/how-it-works-card-section-3-icon.svg`}
              alt='Cup icon'
            />
          </div>
          <h2 className={styles.secondTitle}>How Do Naming Contests Work?</h2>
          <div className={styles.stepsContainer}>
            {CONSTANTS.STEPS.map((step, index) => {
              const isLastStep = index === CONSTANTS.STEPS.length - 1;
              return (
                <Card
                  key={index}
                  title={step.title}
                  description={step.description}
                  variant='steps'
                  isLastStep={isLastStep}
                />
              );
            })}
          </div>
        </section>

        <section>
          <h2 className={styles.secondTitle}>Frequently Asked Questions</h2>
        </section>
      </div>
    </>
  );
}

export default HowItWorks;
