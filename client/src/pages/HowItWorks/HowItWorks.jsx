import React from 'react';
import { FaBolt, FaDesktop, FaLightbulb } from 'react-icons/fa';
import styles from './HowItWorks.module.sass';
import CONSTANTS from './../../constants';
import Card from '../../components/Card/Card';

function HowItWorks () {
  const cardsData = [
    {
      logo: `${CONSTANTS.STATIC_IMAGES_PATH}svg/how-it-works-card-icon-1.svg`,
      title: 'Launch a Contest',
      description:
        'Work with hundreds of creative experts to get custom name suggestions for your business or brand. All names are auto-checked for URL availability.',
      buttonText: 'Launch a Contest',
    },
    {
      logo: `${CONSTANTS.STATIC_IMAGES_PATH}svg/how-it-works-card-icon-2.svg`,
      title: 'Explore Names For Sale',
      description:
        'Our branding team has curated thousands of pre-made names that you can purchase instantly. All names include a matching URL and a complimentary Logo Design.',
      buttonText: 'Explore Names For Sale',
    },
    {
      logo: `${CONSTANTS.STATIC_IMAGES_PATH}svg/how-it-works-card-icon-3.svg`,
      title: 'Agency-level Managed Contests',
      description:
        'Our Managed contests combine the power of crowdsourcing with the rich experience of our branding consultants. Get a complete agency-level experience at a fraction of Agency costs.',
      buttonText: 'Learn More',
    },
  ];

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
            {cardsData.map((card, index) => (
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
      </div>
    </>
  );
}

export default HowItWorks;
