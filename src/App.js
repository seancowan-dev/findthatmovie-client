import React from 'react';
import { Provider } from "mobx-react";
import ErrorBound from './comps/ErrorBound';
import DomainStore from './DomainStore'
import { useRoutes } from 'hookrouter';
import Routes from './routing/Routing';
import './App.css';

const store = {
  dataStore: DomainStore.dataStore,
  searchStore: DomainStore.searchStore,
  helpers: DomainStore.helpers,
  userStore: DomainStore.userStore
}

const App = (props) => {
  const routeResult = useRoutes(Routes); 
  return(
    <Provider {...store}>
      <ErrorBound>
        {routeResult}
      </ErrorBound>
    </Provider>
    );
};
export default App;
