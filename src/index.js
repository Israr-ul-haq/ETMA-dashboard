import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import AccountState from './components/context/account/AccountState';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './authConfig';
const msalInstance = new PublicClientApplication(msalConfig);
ReactDOM.render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <AccountState>
        <App />
      </AccountState>
    </MsalProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
