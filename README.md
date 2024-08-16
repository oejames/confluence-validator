# Confluence Page Validation App

This Forge app adds a validation feature to Confluence Cloud pages, allowing users to mark pages as validated and request validation via Slack notification.

Before:
![image](https://github.com/user-attachments/assets/0393ac6a-25e3-4f7d-97bb-fd40808a13f9)

After:
![image](https://github.com/user-attachments/assets/b9a36158-856a-4c82-a660-3c64539a4533)
![image](https://github.com/user-attachments/assets/362cbdda-f838-4854-ac9f-27b5ac609351)


## Setup Instructions

1. Set up your Forge development environment:
   - Install Node.js (version 18.x or later)
   - Install the Forge CLI:
     ```
     npm install -g @forge/cli
     ```
   - Log in to your Atlassian account:
     ```
     forge login
     ```

2. Create a new Forge app in your Atlassian developer console:
   - Go to https://developer.atlassian.com/console/myapps/
   - Click "Create app"
   - Choose "Forge" as the app type
   - Give your app a name and click "Create"

3. Clone this repository to your local machine.

4. Update the manifest.yml file:
   - Replace the app.id value with your new Forge app ID
   - In the permissions section, update the Slack webhook URL under external.fetch.backend (see Slack Workflow instructions below to obtain the URL)

5. Update the following variable in index.js:
   - CONFLUENCE_URL: Replace with your Confluence URL

6. Create a .env file in the root directory of the project:
  - Add the following line to the file:
  
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX

  Replace the URL with your actual Slack webhook URL (see Slack Workflow instructions below to obtain the URL)

7. Deploy the app to the development environment using the Forge CLI command:
   ```
   forge deploy
   ```

9. Install the app in your Atlassian Confluence Cloud (note: this will isntall the development version):
   ```
   forge install
   ```

11. If ready to deploy for production:
    - Uninstall the development version of the app by clicking "Apps" and "Manage Apps" in Confluence
    - Run the commands:
    ```
    forge deploy --environment production
    ```
      ```
      forge install --environment production
      ```

## Slack Workflow/Webhook Setup

This app sends validation requests to a Slack channel of your choice. To set this up, create a new Slack workflow:

1. Go to your Slack workspace and click on "Apps" in the left sidebar.
2. Search for "Workflow Builder" and open it.
3. Click "Create" to start a new workflow.
4. Choose "Webhook" as the trigger. Copy the webhook URL provided by Slack and update it in both .env  and manifest.yml.
5. Click 'add varialbes' and set the following variables:
- pageOwner
- pageName
- pageLink
6. Add a "Send a message to Slack channel" step.

  - Choose the channel where you want the validation requests to be sent.
  - In the message text, use the following template:
      
@channel: Request for page validation from {{pageOwner}} for the page "{{pageName}}".
      Validate or archive the page here: {{pageLink}}

7. Save the workflow.

## Important Notes

- The Confluence URL and Slack webhook URL need to be updated in both index.js and manifest.yml.
- Ensure your Slack workflow is set up to handle the variables in the format they are sent in the code.
- You may need to adjust permissions in manifest.yml based on your specific Confluence instance settings.

## Troubleshooting

- If you encounter issues with API permissions, double-check the scopes in manifest.yml.
- For any Forge-specific problems, refer to the [Forge documentation](https://developer.atlassian.com/platform/forge/).


## Support

For any questions or issues, please open an issue in this GitHub repository.
