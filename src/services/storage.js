import { storage } from '@forge/api';
import { formatDate } from '../utils/dates';

export const fetchLastValidatedDate = async (contentId) => {
  try {
    const res = await storage.get(`lastValidated-${contentId}`);
    if (res) {
      const { date, userName } = res;
      const formattedDate = formatDate(date);
      return `Last validated on ${formattedDate} by ${userName}`;
    } else {
      return 'Not yet validated';
    }
  } catch (error) {
    console.error('Error fetching last validated date:', error);
    return 'Error fetching date';
  }
};

export const setLastValidatedDate = async (contentId, date, userName) => {
  try {
    await storage.set(`lastValidated-${contentId}`, { date: new Date(date).toISOString(), userName });
  } catch (error) {
    console.error('Error setting last validated date:', error);
    throw error;
  }
};