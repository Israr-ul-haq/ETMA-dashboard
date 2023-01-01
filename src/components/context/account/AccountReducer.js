
const AccountReducer = (state, action) => {
  switch (action.type) {
    case 'MSAL':
      return action.account
    default:
      return state;
  }
};

export default AccountReducer;
