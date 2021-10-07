import dateFormat from 'dateformat';

export const convertTimestampToDate = (timestamp) => {
  if (!timestamp) return undefined;

  // Timestamp is in seconds, and new Date() only accepts
  // timestamps in milliseconds. So, we multiply 1000 to it.
  const date = new Date(timestamp * 1000);

  return dateFormat(date, 'mm/dd/yyyy');
};

export const convertTimestampToTimeWithSuffix = (timestamp) => {
  if (!timestamp) return undefined;

  // Timestamp is in seconds, and new Date() only accepts
  // timestamps in milliseconds. So, we multiply 1000 to it.
  const date = new Date(timestamp * 1000);

  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';

  hours %= 12;
  hours = hours || 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${hours < 10 ? '0' : ''}${hours}:${minutes} ${ampm}`;
};
