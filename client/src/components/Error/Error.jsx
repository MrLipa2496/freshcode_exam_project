import styles from './Error.module.sass';

const Error = props => {
  const getMessage = () => {
    const { status, data } = props;

    const extractMessage = value =>
      typeof value === 'string' ? value : value?.message || 'Unexpected error';

    switch (status) {
      case 404:
      case 409:
      case 406:
        return extractMessage(data);
      case 400:
        return 'Check the input data';
      case 403:
        return 'Bank decline transaction';
      default:
        return 'Server Error';
    }
  };

  const { clearError } = props;
  return (
    <div className={styles.errorContainer}>
      <span>{getMessage()}</span>
      <i className='far fa-times-circle' onClick={() => clearError()} />
    </div>
  );
};

export default Error;
