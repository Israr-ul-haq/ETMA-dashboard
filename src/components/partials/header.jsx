import { Link, useHistory } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import $ from 'jquery';
import { useMsal } from '@azure/msal-react';
import AccountContext from '../context/account/AccountContext';
import { PublicClientApplication } from '@azure/msal-browser';
import { useIsAuthenticated } from '@azure/msal-react';
function Header() {
  const history = useHistory();
  const isAuthenticated = useIsAuthenticated();

  const { dispatch } = useContext(AccountContext);
  const { instance } = useMsal();
  const toggleClass = () => {
    $('#app-container').toggleClass('main-hidden');
  };

  const msalInstance = new PublicClientApplication({
    auth: {
      clientId: '5bace35c-c4a9-47f8-8fde-8f027c364c9f',
      authority:
        'https://login.microsoftonline.com/fc418f16-5c93-437d-b743-05e9e2a04d93',
      postLogoutRedirectUri: 'https://localhost:3000/',
    },
    cache: {
      cacheLocation: 'localStorage', // This configures where your cache will be stored
      storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
  });

  function handleLogout(instance) {
    localStorage.clear();
    history.push('/');
  }

  useEffect(() => {
    debugger;
    if (!JSON.parse(localStorage.getItem('etmauser'))) {
      history.push('/');
    }
  }, [history]);

  return (
    <nav className='navbar fixed-top top-menu dasboard-top-menu'>
      <div className='d-flex align-items-center navbar-left'>
        <img className='menu-logo' src='./assets/images/Logo.png' />
        <Link
          onClick={toggleClass}
          to='#'
          className='menu-button d-none d-md-block'
        >
          <img className='' src='./assets/images/list.svg' />
        </Link>
        <Link
          onClick={toggleClass}
          to='#'
          className='menu-button-mobile d-xs-block d-sm-block d-md-none'
        >
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 26 17'>
            <rect x='0.5' y='0.5' width='25' height='1' />
            <rect x='0.5' y='7.5' width='25' height='1' />
            <rect x='0.5' y='15.5' width='25' height='1' />
          </svg>
        </Link>
      </div>

      <div className='navbar-right'>
        <div className='header-icons d-inline-block align-middle'></div>

        <div className='user d-inline-block'>
          <button
            className='btn btn-empty p-0'
            type='button'
            aria-haspopup='true'
            aria-expanded='false'
          >
            <button
              className='btn btn-empty p-0'
              onClick={() => handleLogout(instance)}
            >
              <span className='name dashboard-profile-name'>Logout</span>
            </button>
            {/* <Link to={'/'} className='btn btn-empty p-0'>
              <span className='name dashboard-profile-name'>Logout</span>
            </Link> */}
            <span>
              <img alt='Profile Picture' src='./assets/images/Profile.png' />
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
export default Header;
