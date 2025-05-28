import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { differenceInMilliseconds } from 'date-fns';
import { AiOutlineDelete } from 'react-icons/ai';
import { deleteEvent } from '../../store/slices/eventsSlice';
import styles from './TimerItem.module.sass';
import UTILS from '../../utils/utils';

const calculateProgress = (eventTimestamp, createdTimestamp) => {
  const now = Date.now();
  const totalTime = differenceInMilliseconds(eventTimestamp, createdTimestamp);
  const timeRemaining = differenceInMilliseconds(eventTimestamp, now);

  if (timeRemaining <= 0) return 100;
  if (totalTime <= 0) return 0;
  return Math.max(0, 100 - (timeRemaining / totalTime) * 100);
};

const TimerItem = ({ event }) => {
  const [timeLeft, setTimeLeft] = useState(
    differenceInMilliseconds(event.eventTimestamp, Date.now())
  );
  const [progress, setProgress] = useState(0);
  const dispatch = useDispatch();

  const updateTimer = useCallback(() => {
    const eventTimestamp = new Date(event.eventTimestamp).getTime();
    const createdTimestamp = event.createdTimestamp
      ? new Date(event.createdTimestamp).getTime()
      : Date.now();

    const timeRemaining = differenceInMilliseconds(eventTimestamp, Date.now());
    setTimeLeft(Math.max(0, timeRemaining));
    setProgress(calculateProgress(eventTimestamp, createdTimestamp));
  }, [event.eventTimestamp, event.createdTimestamp]);

  useEffect(() => {
    updateTimer();
    const timerId = setInterval(updateTimer, 1000);
    return () => clearInterval(timerId);
  }, [updateTimer]);

  const handleDelete = useCallback(() => {
    dispatch(deleteEvent(event.id));
  }, [dispatch, event.id]);

  return (
    <div className={styles.timerItem}>
      <motion.div
        className={styles.progressBar}
        initial={{ width: '0%' }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5 }}
      />

      <div className={styles.details}>
        <p className={styles.eventName}>{event.eventName}</p>
      </div>

      <div className={styles.actions}>
        <p className={styles.timeLeft}>{UTILS.FORMAT_TIMER_LEFT(timeLeft)}</p>
        <button className={styles.deleteButton} onClick={handleDelete}>
          <AiOutlineDelete />
        </button>
      </div>
    </div>
  );
};

export default React.memo(TimerItem);
