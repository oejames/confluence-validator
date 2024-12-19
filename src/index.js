import ForgeUI, { render, Macro } from '@forge/ui';
import App from './components/App';

export const run = render(
  <Macro
    app={<App />}
  />
);