import { useReducer, useEffect } from 'react';
import AccountContext from './AccountContext';
import AccountReducer from './AccountReducer';
const AccountState = (props) => {
  //Context

  const [account, dispatch] = useReducer(AccountReducer, []);

  return (
    <AccountContext.Provider
      value={{
       account,
        dispatch,
      }}
    >
      {props.children}
    </AccountContext.Provider>
  );
};

export default AccountState;
