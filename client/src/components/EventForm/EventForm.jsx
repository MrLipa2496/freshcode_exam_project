import { Formik, Form } from 'formik';
import { useDispatch } from 'react-redux';
import styles from './EventForm.module.sass';
import Schems from '../../utils/validators/validationSchems';
import ValidatedField from '../ValidatedField/ValidatedField';
import { addEvent } from '../../store/slices/eventsSlice';

const prepareEvent = values => {
  const { eventName, eventDate, eventTime, notificationTime } = values;

  const eventTimestamp = new Date(`${eventDate}T${eventTime}`).getTime();

  return {
    id: Date.now(),
    eventName,
    eventTimestamp,
    createdTimestamp: Date.now(),
    notificationTime: Number(notificationTime),
  };
};

const EventForm = () => {
  const dispatch = useDispatch();

  const initialValues = {
    eventName: '',
    eventDate: '',
    eventTime: '',
    notificationTime: '',
  };

  const handleSubmit = (values, { resetForm }) => {
    const event = prepareEvent(values);
    dispatch(addEvent(event));
    resetForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Schems.EventsSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className={styles.form}>
          <label htmlFor='eventName' className={styles.label}>
            Event Name
          </label>
          <ValidatedField
            name='eventName'
            type='text'
            placeholder='Enter event name'
          />
          <label htmlFor='eventDate' className={styles.label}>
            Event Date
          </label>
          <ValidatedField
            name='eventDate'
            type='date'
            placeholder='Select event date'
          />
          <label htmlFor='eventTime' className={styles.label}>
            Event Time
          </label>
          <ValidatedField
            name='eventTime'
            type='time'
            placeholder='Select event time'
          />
          <label htmlFor='notificationTime' className={styles.label}>
            Notify Before (minutes)
          </label>
          <ValidatedField
            name='notificationTime'
            type='number'
            placeholder='Enter minutes'
          />

          <button
            type='submit'
            disabled={isSubmitting}
            className={`${styles.submitButton} ${
              isSubmitting ? styles.disabledButton : ''
            }`}
          >
            {isSubmitting ? 'Adding...' : 'Add Event'}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default EventForm;
