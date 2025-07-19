import { useSelector, useDispatch } from 'react-redux';
import EventForm from '../../components/EventForm/EventForm';
import TimerList from '../../components/TimerList/TimerList';
import styles from './EventsPage.module.sass';
import { setCurrentUser } from '../../store/slices/eventsSlice';
import { useEffect } from 'react';

function EventsPage () {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.userStore.data.id);

  useEffect(() => {
    if (userId) {
      console.log('Dispatching setCurrentUser with userId:', userId);
      dispatch(setCurrentUser(userId));
    }
  }, [dispatch, userId]);

  if (!userId) return <div>Loading user...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Events</h1>
      <p className={styles.subtitle}>
        Plan your events, set reminders, and stay organized every day. All the
        important moments are now gathered in one place, so you never miss a
        thing.
      </p>
      <div className={styles.formListContainer}>
        <EventForm />
        <TimerList />
      </div>
    </div>
  );
}

export default EventsPage;
