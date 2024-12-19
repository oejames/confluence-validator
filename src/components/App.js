import ForgeUI, {
    Fragment,
    Text,
    Button,
    useProductContext,
    useState,
    useEffect,
    InlineDialog,
    ContentBylineItem
  } from '@forge/ui';
  import { fetchLastValidatedDate, setLastValidatedDate } from '../services/storage';
  import { getPageOwner, getUserName, getPageDetails } from '../services/confluenceApi';
  import { sendSlackMessage } from '../services/slackApi';
  import { SLACK_WEBHOOK_URL } from '../config/constants';
  import { formatDate } from '../utils/dates';
  
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
        const userName = await getUserName(context.accountId);
  
        await setLastValidatedDate(context.contentId, now.toISOString(), userName);
        const formattedDate = formatDate(now);
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
  
  export default App;