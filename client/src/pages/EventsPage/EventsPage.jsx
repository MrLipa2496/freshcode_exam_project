import { useState } from 'react';
import BadgeNotification from '../../components/BadgeNotification/BadgeNotification';
import EventForm from '../../components/EventForm/EventForm';
import TimerList from '../../components/TimerList/TimerList';
import styles from './EventsPage.module.sass';

function EventsPage () {
  const [events, setEvents] = useState([]);

  const handleAddEvent = newEvent => {
    setEvents(prev =>
      [...prev, newEvent].sort((a, b) => a.eventTimestamp - b.eventTimestamp)
    );
  };

  const handleDeleteEvent = id => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Events</h1>
      <p className={styles.subtitle}>
        Plan your events, set reminders, and stay organized every day. All the
        important moments are now gathered in one place, so you never miss a
        thing.
      </p>
      <div className={styles.formListContainer}>
        <EventForm onAddEvent={handleAddEvent} />
        <TimerList events={events} onDeleteEvent={handleDeleteEvent} />
      </div>
    </div>
  );
}

export default EventsPage;
