import * as yup from 'yup';
import valid from 'card-validator';
import { parseISO, isBefore, startOfDay, set } from 'date-fns';

export default {
  LoginSchem: yup.object().shape({
    email: yup.string().email('check email').required('required'),
    password: yup
      .string()
      .test(
        'test-password',
        'min 6 symbols',
        value => value && value.trim().length >= 6
      )
      .required('required'),
  }),
  RegistrationSchem: yup.object().shape({
    email: yup.string().email('check email').required('Email is required'),
    password: yup
      .string()
      .test(
        'test-password',
        'min 6 symbols',
        value => value && value.trim().length >= 6
      )
      .required('required'),
    confirmPassword: yup
      .string()
      .required('confirm password is required')
      .oneOf([yup.ref('password')], 'confirmation pass must match password'),
    firstName: yup
      .string()
      .test(
        'test-firstName',
        'required',
        value => value && value.trim().length >= 1
      )
      .required('First Name is required'),
    lastName: yup
      .string()
      .test(
        'test-lastName',
        'required',
        value => value && value.trim().length >= 1
      )
      .required('Last Name is required'),
    displayName: yup
      .string()
      .test(
        'test-displayName',
        'required',
        value => value && value.trim().length >= 1
      )
      .required('Display Name is required'),
    role: yup
      .string()
      .matches(/(customer|creator)/)
      .required('Role is required'),
    agreeOfTerms: yup
      .boolean()
      .oneOf([true], 'Must Accept Terms and Conditions')
      .required('Must Accept Terms and Conditions'),
  }),
  ContestSchem: yup.object({
    nameVenture: yup.string().min(3),
    contestType: yup
      .string()
      .matches(/(name|tagline|logo)/)
      .required(),
    title: yup
      .string()
      .test(
        'test-title',
        'required',
        value => value && value.trim().length >= 1
      )
      .required('title of contest required'),
    industry: yup.string().required('industry required'),
    focusOfWork: yup
      .string()
      .test(
        'test-focusOfWork',
        'required',
        value => value && value.trim().length >= 1
      )
      .required('focus of work required'),
    targetCustomer: yup
      .string()
      .test(
        'test-targetCustomer',
        'required',
        value => value && value.trim().length >= 1
      )
      .required('target customers required'),
    styleName: yup.string().min(1),
    typeOfName: yup.string().min(1),
    typeOfTagline: yup.string().min(1),
    brandStyle: yup.string().min(1),
    file: yup.mixed(),
  }),
  filterSchem: yup.object().shape({
    typeIndex: yup.number().oneOf[(1, 2, 3, 4, 5, 6, 7)],
    contestId: yup.string(),
    awardSort: yup.string().matches(/(desc|asc)/),
    industry: yup.string(),
  }),
  LogoOfferSchema: yup.object().shape({
    offerData: yup.mixed().required('required'),
  }),
  TextOfferSchema: yup.object().shape({
    offerData: yup
      .string()
      .test(
        'test-offerData',
        'required',
        value => value && value.trim().length >= 1
      )
      .required('suggestion is required'),
  }),
  PaymentSchema: yup.object().shape({
    number: yup
      .string()
      .test(
        'test-cardNumber',
        'Credit Card number is invalid',
        value => valid.number(value).isValid
      )
      .required('required'),
    name: yup
      .string()
      .min(1, 'required atleast one symbol')
      .required('required'),
    cvc: yup
      .string()
      .test('test-cvc', 'cvc is invalid', value => valid.cvv(value).isValid)
      .required('required'),
    expiry: yup
      .string()
      .test(
        'test-expiry',
        'expiry is invalid',
        value => valid.expirationDate(value).isValid
      )
      .required('required'),
  }),
  CashoutSchema: yup.object().shape({
    sum: yup.number().min(5, 'min sum is 5$').required('required'),
    number: yup
      .string()
      .test(
        'test-cardNumber',
        'Credit Card number is invalid',
        value => valid.number(value).isValid
      )
      .required('required'),
    name: yup.string().min(1).required('required'),
    cvc: yup
      .string()
      .test('test-cvc', 'cvc is invalid', value => valid.cvv(value).isValid)
      .required('required'),
    expiry: yup
      .string()
      .test(
        'test-expiry',
        'expiry is invalid',
        value => valid.expirationDate(value).isValid
      )
      .required('required'),
  }),
  UpdateUserSchema: yup.object().shape({
    firstName: yup
      .string()
      .test(
        'test-firstName',
        'required',
        value => value && value.trim().length >= 1
      )
      .required('required'),
    lastName: yup
      .string()
      .test(
        'test-lastName',
        'required',
        value => value && value.trim().length >= 1
      )
      .required('required'),
    displayName: yup
      .string()
      .test(
        'test-displayName',
        'required',
        value => value && value.trim().length >= 1
      )
      .required('required'),
    file: yup.mixed(),
  }),

  MessageSchema: yup.object({
    message: yup.string().trim().required('').min(1, ''),
  }),
  CatalogSchema: yup.object({
    catalogName: yup
      .string()
      .test(
        'test-catalogName',
        'required',
        value => value && value.trim().length >= 1
      )
      .required('required'),
  }),
  EventsSchema: yup.object({
    eventName: yup.string().required('Event name is required'),
    eventDate: yup
      .date()
      .required('Event date is required')
      .min(startOfDay(new Date()), 'Date cannot be in the past'),
    eventTime: yup
      .string()
      .required('Event time is required')
      .test('is-future-time', 'Time must be in the future', function (value) {
        if (!value) return true;

        const { eventDate } = this.parent;
        if (!eventDate) return false;

        const parsedEventDate =
          typeof eventDate === 'string' ? parseISO(eventDate) : eventDate;

        if (isNaN(parsedEventDate)) {
          return false;
        }

        const [hours, minutes] = value.split(':').map(Number);

        const eventDateTime = set(parsedEventDate, {
          hours,
          minutes,
          seconds: 0,
          milliseconds: 0,
        });

        const now = new Date();
        const roundedNow = set(now, {
          hours: now.getHours(),
          minutes: now.getMinutes(),
          seconds: 0,
          milliseconds: 0,
        });

        return !isBefore(eventDateTime, roundedNow);
      }),
    notificationTime: yup
      .number()
      .required('Notification time is required')
      .min(1, 'Must be at least 1 minute')
      .max(1440, 'Cannot exceed 1440 minutes (24 hours)')
      .test(
        'is-not-too-close',
        'Event is too soon for this reminder time',
        function (value) {
          const { eventDate, eventTime } = this.parent;
          if (!eventDate || !eventTime || !value) return true;

          const eventDateObj =
            typeof eventDate === 'string' ? parseISO(eventDate) : eventDate;

          if (isNaN(eventDateObj)) return false;

          const [hours, minutes] = eventTime.split(':').map(Number);
          const eventTimestamp = set(eventDateObj, {
            hours,
            minutes,
            seconds: 0,
            milliseconds: 0,
          }).getTime();

          const now = Date.now();
          const notifyTimeMs = value * 60 * 1000;

          return eventTimestamp - now > notifyTimeMs;
        }
      ),
  }),
};
