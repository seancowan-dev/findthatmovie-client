import React, { useEffect, useState } from 'react';
import { navigate } from 'hookrouter';
import { Provider } from "mobx-react";
import ErrorBound from './comps/ErrorBound';
import DomainStore from './DomainStore';
import TokenService from './services/token-service';
import IdleService from './services/idle-service';
import AuthApiService from './services/auth-api-service';
import './App.css';
import './semantic.css';

const store = {
  dataStore: DomainStore.dataStore,
  searchStore: DomainStore.searchStore,
  helpers: DomainStore.helpers,
  userStore: DomainStore.userStore,
  validators: DomainStore.validators
}

window.addEventListener("load", (e) => {
  let links = DomainStore.helpers.makeLoginLinks(DomainStore.userStore); // Get default response so logoutLinks are always available
  if (TokenService.hasAuthToken()) { // User still has valid auth token from prior login
    DomainStore.helpers.handleReturningUser();
  }
  if (!TokenService.hasAuthToken()) { // User has not logged in
    DomainStore.userStore.setValidNavLinks(links.logoutLinks); // Set data using mobx action
  }
})

const App = (props) => {
  const [dummy, reload] = useState(false);

  const LogoutFromIdle = () => {
    /* remove the token from localStorage */
    TokenService.clearAuthToken()
    /* remove any queued calls to the refresh endpoint */
    TokenService.clearCallbackBeforeExpiry()
    /* remove the timeouts that auto logout when idle */
    IdleService.unregisterIdleResets()
    // /*
    //   react won't know the token has been removed from local storage,
    //   so we need to tell React to rerender
    // */
    navigate("/logout");
  }
  useEffect(() => {
    /*
      set the function (callback) to call when a user goes idle
      we'll set this to logout a user when they're idle
    */
   IdleService.setIdleCallback(LogoutFromIdle);
    
   /* if a user is logged in */
   if (TokenService.hasAuthToken()) {
     /*
       tell the idle service to register event listeners
       the event listeners are fired when a user does something, e.g. move their mouse
       if the user doesn't trigger one of these event listeners,
         the idleCallback (logout) will be invoked
     */
     IdleService.registerIdleTimerResets()

     /*
       Tell the token service to read the JWT, looking at the exp value
       and queue a timeout just before the token expires
     */
     TokenService.queueCallbackBeforeExpiry(() => {
       /* the timoue will call this callback just before the token expires */
       AuthApiService.postRefreshToken()
     })
   }
    return function cleanup() {
       /*
      when the app unmounts,
      stop the event listeners that auto logout (clear the token from storage)
    */
    IdleService.unregisterIdleResets()
    /*
      and remove the refresh endpoint request
    */
    TokenService.clearCallbackBeforeExpiry()
    };
  });

  
  return(
    <Provider {...store}>
      <ErrorBound>
        {props.routes}
      </ErrorBound>
    </Provider>
    );
};

export default App;
