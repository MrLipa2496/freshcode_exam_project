import React from 'react';
import styles from './HowItWorks.module.sass';
import CONSTANTS from './../../constants';
function HowItWorks () {
  return (
    <>
      <div className={styles.wrapper}>
        <section className={styles.namingPlatform}>
          <div className={styles.namingPlatformInfo}>
            <p className={styles.subTitle}>World's #1 Naming Platform</p>
            <h2 className={styles.title}>How Does Atom Work?</h2>
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
      </div>
    </>
  );
}

export default HowItWorks;
