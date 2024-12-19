import { fetchLastValidatedDate } from '../services/storage';

export const dynamicPropertiesHandler = async ({ extension }) => {
  const contentId = extension.content.id;
  try {
    let lastValidatedDate = await fetchLastValidatedDate(contentId);

    if (lastValidatedDate !== 'Not yet validated' && !lastValidatedDate.startsWith('Error')) {
      const atIndex = lastValidatedDate.indexOf(' at ');
      if (atIndex !== -1) {
        lastValidatedDate = lastValidatedDate.substring(0, atIndex);
      }
    }

    return {
      title: `${lastValidatedDate}`,
    };
  } catch (error) {
    console.error('Error fetching dynamic properties:', error);
    return {
      title: 'Last Validated: Error',
    };
  }
};