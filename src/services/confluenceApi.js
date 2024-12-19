import api, { route } from '@forge/api';
import { CONFLUENCE_URL } from '../config/constants';

export const getPageOwner = async (pageId) => {
  try {
    const response = await api.asUser().requestConfluence(route`/wiki/api/v2/pages/${pageId}`, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      return data.ownerId;
    } else {
      console.error('Failed to fetch page details:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching page owner:', error);
  }
};

export const getUserName = async (accountId) => {
  try {
    const response = await api.asUser().requestConfluence(route`/wiki/rest/api/user?accountId=${accountId}`, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      return data.displayName;
    } else {
      throw new Error(`Failed to fetch user details: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};

export const getPageDetails = async (contentId) => {
  try {
    const response = await api.asUser().requestConfluence(route`/wiki/rest/api/content/${contentId}`, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      return {
        pageName: data.title,
        pageLink: `${CONFLUENCE_URL}/${data.spaceKey}/pages/${contentId}/${data.title}`,
        spaceKey: data.spaceKey, 
      };
    } else {
      throw new Error(`Failed to fetch page details: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error fetching page details:', error);
    throw error;
  }
};