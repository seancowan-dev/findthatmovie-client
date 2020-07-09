import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from "mobx-react";
import DomainStore from '../DomainStore';
import Nav from './Nav';

const store = {
    dataStore: DomainStore.dataStore,
    searchStore: DomainStore.searchStore,
    helpers: DomainStore.helpers,
    userStore: DomainStore.userStore,
    validators: DomainStore.validators
  }

describe('| Nav Test Object |', () => {
  it('should render correctly in "debug" mode', () => {
    const component = shallow(<Provider {...store}><Nav debug /></Provider>);
    expect(component).toMatchSnapshot();
  });
  it('should render correctly in "production" mode', () => {
    const component = shallow(<Provider {...store}><Nav production /></Provider>);
    expect(component).toMatchSnapshot();
  });
});