import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from "mobx-react";
import DomainStore from '../../DomainStore';
import LoginPage from './LoginPage';

const store = {
    dataStore: DomainStore.dataStore,
    searchStore: DomainStore.searchStore,
    helpers: DomainStore.helpers,
    userStore: DomainStore.userStore,
    validators: DomainStore.validators
  }

describe('| LoginPage Test Object |', () => {
  it('should render correctly in "debug" mode', () => {
    const component = shallow(<Provider {...store}><LoginPage debug /></Provider>);
    expect(component).toMatchSnapshot();
  });
  it('should render correctly in "production" mode', () => {
    const component = shallow(<Provider {...store}><LoginPage production /></Provider>);
    expect(component).toMatchSnapshot();
  });
});