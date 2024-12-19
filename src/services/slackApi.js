import fetch from 'node-fetch';

export const sendSlackMessage = async (webhookUrl, pageOwner, pageName, pageLink) => {
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
