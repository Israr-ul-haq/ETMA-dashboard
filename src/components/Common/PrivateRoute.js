import React, { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useIsAuthenticated } from '@azure/msal-react';
const PrivateRoute = ({ component: Component, ...rest }) => {
  //State
  const isAuthenticated = useIsAuthenticated();

  return (
    <Route
      {...rest}
      render={(props) => {
        JSON.parse(localStorage.getItem('etmauser')) ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/', state: { from: props.location } }} />
        );
      }}
    />
  );
};

export default PrivateRoute;
