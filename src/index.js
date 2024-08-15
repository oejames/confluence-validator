import ForgeUI, {
  render,
  Fragment,
  Text,
  Button,
  useProductContext,
  useState,
  useEffect,
  Macro,
  InlineDialog,
  ContentBylineItem
} from '@forge/ui';
import api, { storage, route } from '@forge/api';
import fetch from 'node-fetch'; 

// Constants
const CONFLUENCE_URL = 'https://wbg-itss-sandbox-913.atlassian.net';
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL; 


const fetchLastValidatedDate = async (contentId) => {
  try {
    const res = await storage.get(`lastValidated-${contentId}`);
    if (res) {
      const { date, userName } = res;
      const formattedDate = new Date(date).toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });
      return `Last validated on ${formattedDate} by ${userName}`;
    } else {
      return 'Not yet validated';
    }
  } catch (error) {
    console.error('Error fetching last validated date:', error);
    return 'Error fetching date';
  }
};

const setLastValidatedDate = async (contentId, date, userName) => {
  try {
    await storage.set(`lastValidated-${contentId}`, { date: new Date(date).toISOString(), userName });
  } catch (error) {
    console.error('Error setting last validated date:', error);
    throw error;
  }
};

const getPageOwner = async (pageId) => {
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

const getUserName = async (accountId) => {
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

const getPageDetails = async (contentId) => {
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

const sendSlackMessage = async (webhookUrl, pageOwner, pageName, pageLink) => {
  try {
    const payload = {
      pageOwner: pageOwner,
      pageName: pageName,
      pageLink: pageLink
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    console.log('Slack response:', await response.text());
  } catch (error) {
    console.error('Error sending Slack message:', error);
    throw error;
  }
};

const App = () => {
  const context = useProductContext();
  const [lastValidated, setLastValidated] = useState('Loading...');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(async () => {
    try {
      const date = await fetchLastValidatedDate(context.contentId);
      setLastValidated(date);
    } catch (error) {
      setError('Failed to fetch last validated date');
    }
  }, []);

  const handleValidate = async () => {
    try {
      const now = new Date();
      const userName = await getUserName(context.accountId); // fetch the user who clicked the button

      await setLastValidatedDate(context.contentId, now.toISOString(), userName);

      const formattedDate = now.toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });

      setLastValidated(`Last validated on ${formattedDate} by ${userName}`);
    } catch (error) {
      console.error('Validation error:', error);
      setError('Failed to update validation date');
    }
  };

  const handleRequestValidation = async () => {
    try {
      const pageOwnerAccountId = await getPageOwner(context.contentId);
      const userName = await getUserName(pageOwnerAccountId);
      setIsDialogOpen(true);

      const { pageName, pageLink } = await getPageDetails(context.contentId);
      await sendSlackMessage(SLACK_WEBHOOK_URL, userName, pageName, pageLink);
    } catch (error) {
      console.error('Request validation error:', error);
      setError('Failed to send validation request to slack');
    }
  };

  return (
    <ContentBylineItem>
      <InlineDialog header="Page Validation" isOpen={true}>
        {error ? (
          <Text>{error}</Text>
        ) : (
          <Fragment>
            <Text>{lastValidated}</Text>
            <Button text="Validate" onClick={handleValidate} />
            <Button text="Request Validation" onClick={handleRequestValidation} />
          </Fragment>
        )}
        {isDialogOpen && (
          <Text>Validation request sent to Slack Channel.</Text>
        )}
      </InlineDialog>
    </ContentBylineItem>
  );
};

// function that handles creating the title of the in-line button (ex. 'Last Validated on [date]')
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

export const run = render(
  <Macro
    app={<App />}
  />
);
