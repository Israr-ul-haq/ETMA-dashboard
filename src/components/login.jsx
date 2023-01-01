import { Link, useHistory } from 'react-router-dom';
import MicrosoftLogin from 'react-microsoft-login';
import React, { useState, useContext, useEffect } from 'react';
import AccountContext from './context/account/AccountContext';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../authConfig';
import { PublicClientApplication } from '@azure/msal-browser';
import { useIsAuthenticated } from '@azure/msal-react';

function Login() {
  const history = useHistory();
  const isAuthenticated = useIsAuthenticated();

  //Context
  const { dispatch } = useContext(AccountContext);
  const { instance } = useMsal();

  const msalInstance = new PublicClientApplication({
    auth: {
      clientId: '7bc2d2ba-06e5-46f3-b463-cc1d0a5fea4e',
    authority: 'https://login.microsoftonline.com/fc418f16-5c93-437d-b743-05e9e2a04d93',
      redirectUri: 'http://localhost:3000/users',
    },
    cache: {
      cacheLocation: 'localStorage', // This configures where your cache will be stored
      storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
    prompt: 'select_account',
  });

  function handleLogin(instance) {
    instance
      .loginPopup({ prompt: 'select_account' })
      .then((idToken) => {
        localStorage.setItem('etmauser', JSON.stringify(idToken));
        history.push('/users'); // if you want to direct the user to a page after login
      })
      .catch((e) => {
        console.error(e);
      });
  }

  useEffect(() => {
    if (JSON.parse(localStorage.getItem('etmauser'))) {
      history.push('/users');
    }
  }, [history]);

  return (
    <main>
      <div className='container-fluid'>
        <div className='row'>
          <div className='card login-form-card'>
            <div className='card-body login-form'>
              <div className='card-body-right'>
                <img src='./assets/images/Vector01.jpg' alt='login-img' />
              </div>
              <div className='card-body-left'>
                <div
                  onClick={() => handleLogin(instance)}
                  class='login-ms-button'
                >
                  <img src='assets/images/Microsoft.png' />
                  <button>Sign in with Microsoft</button>
                </div>

                {/* <Link to={'/users'} class='login-ms-button'>
                  <img src='assets/images/Microsoft.png' />
                  <button>Sign in with Microsoft</button>
                </Link> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;
