import React, { memo, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PiClockCountdownBold } from 'react-icons/pi';
import TimerItem from '../TimerItem/TimerItem';
import { deleteEvent } from '../../store/slices/eventsSlice';
import { Scrollbars } from 'react-custom-scrollbars-2';
import styles from './TimerList.module.sass';

const useSortedEvents = () => {
  const events = useSelector(state => state.eventsStore.events);

  return useMemo(
    () => events.slice().sort((a, b) => a.eventTimestamp - b.eventTimestamp),
    [events]
  );
};

const TimerList = () => {
  const events = useSortedEvents();
  const dispatch = useDispatch();

  const handleDeleteEvent = id => {
    dispatch(deleteEvent(id));
  };

  return (
    <div className={styles.timerList}>
      <div className={styles.header}>
        <h2 className={styles.title}>Live upcoming checks</h2>
        <p className={styles.remain}>
          Remaining time
          <PiClockCountdownBold className={styles.clock} />
        </p>
      </div>
      <Scrollbars
        renderThumbVertical={props => (
          <div {...props} className={styles.scrollThumb} />
        )}
        universal={true}
      >
        <div className={styles.scrollContent}>
          {events.length === 0 ? (
            <p className={styles.emptyMessage}>
              No events added yet. Use the form to add a new timer!
            </p>
          ) : (
            events.map(event => (
              <TimerItem
                key={event.id}
                event={event}
                onDeleteEvent={() => handleDeleteEvent(event.id)}
              />
            ))
          )}
        </div>
      </Scrollbars>
    </div>
  );
};

export default memo(TimerList);
