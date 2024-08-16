# Confluence Page Validation App

This Forge app adds a validation feature to Confluence Cloud pages, allowing users to mark pages as up-to-date and request validation to page owners via Slack notification. 

Before:  
<img src="https://github.com/user-attachments/assets/9f53472c-467a-4b56-8e34-318588de9622" alt="Before Image" width="700"/>

After:  

<img src="https://github.com/user-attachments/assets/e8b1b341-b112-4749-9e3c-de72df8b61da" alt="After Image 1" width="700"/>
<img src="https://github.com/user-attachments/assets/362cbdda-f838-4854-ac9f-27b5ac609351" alt="After Image 2" width="700"/>

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

3. Clone this repository to your local machine

4. Update the manifest.yml file:
   - Replace the app.id value with your new Forge app ID
   - In the permissions section, update the Slack webhook URL under external.fetch.backend (see Slack Workflow instructions below to obtain the URL)

5. Update the following variable in src/index.js:
   - CONFLUENCE_URL: Replace with your Confluence URL

6. Create a .env file in the root directory of the project:
  - Add the following line to the file:
  
      ```
      SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX
      ```

  Replace the URL with your actual Slack webhook URL (see Slack Workflow instructions below to obtain the URL)

7. Deploy the app to the development environment using the Forge CLI command:
   ```
   forge deploy
   ```

9. Install the app in your Atlassian Confluence Cloud (note: this command will install to the development environment):
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

1. Go to your Slack workspace and click on "Add Apps" in the left sidebar 
<img src="https://github.com/user-attachments/assets/96225b91-fa99-4517-8759-e7e70d62c761" alt="Slack Apps" width="250"/>

2. Click on Workflows and create a new workflow 
<img src="https://github.com/user-attachments/assets/2f5a899e-27ec-4024-bbc7-a260dd37dfab" alt="New Workflow" width="300"/>

3. Choose "From a webhook" to start the workflow

4. Click "Set Up Variables" and add the following variables:
- pageOwner
- pageName
- pageLink 

<img src="https://github.com/user-attachments/assets/602a6f3a-3e15-4786-9093-9fd4b577dea1" alt="Setup Variables 2" width="400"/>

5. Copy the webhook URL provided by Slack under "Web Request URL" and update it in .env and manifest.yml


6. Add a new step "Send a message to Slack channel" to the workflow 
<img src="https://github.com/user-attachments/assets/70ffb5d6-feaf-40c7-a4f9-514e0512ed06" alt="Slack Message" width="300"/>



  - Choose a channel to send the validation requests
  - In the message text, copy the following template:
      
     ```
      @channel: Request for page validation in Confluence for the page "{{pageName}}" owned by {{pageOwner}}.
      Please validate or archive the page here: {{pageLink}}
      ```
<img src="https://github.com/user-attachments/assets/4afc85ad-93e3-4603-bd58-8074d20298e2" alt="Message Template" width="300"/>

7. Save the workflow

## Usage
The app adds a "Last Validated" section to the content byline of Confluence Cloud pages. Users can click a "Validate" button to update this date or a "Request Validation" button to send a validation request notification via Slack.

## Important Notes

- The Slack webhook URL needs to be updated in both .env and manifest.yml
- Ensure your Slack workflow is set up to handle the variables in the format they are sent in the code
- You may need to adjust permissions in manifest.yml based on your specific Confluence instance settings

## Troubleshooting

- If you encounter issues with API permissions, double-check the scopes in manifest.yml
- For any Forge-specific problems, refer to the [Forge documentation](https://developer.atlassian.com/platform/forge/).


## Support

For any questions or issues, please open an issue in this GitHub repository.
