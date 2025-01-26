const FORMAT_TIMER_LEFT = milliseconds => {
  if (milliseconds <= 0) return 'Event started!';

  const seconds = Math.floor((milliseconds / 1000) % 60);
  const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
  const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
  const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));

  return `${days > 0 ? `${days}d ` : ''}${hours > 0 ? `${hours}h ` : ''}${
    minutes > 0 ? `${minutes}m ` : ''
  }${seconds}s`.trim();
};

const UTILS = {
  FORMAT_TIMER_LEFT,
};

export default UTILS;
