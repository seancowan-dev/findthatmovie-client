import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from "mobx-react";
import DomainStore from '../DomainStore';
import Register from './Register';

const store = {
    dataStore: DomainStore.dataStore,
    searchStore: DomainStore.searchStore,
    helpers: DomainStore.helpers,
    userStore: DomainStore.userStore,
    validators: DomainStore.validators
  }

describe('| Register Test Object |', () => {
  it('should render correctly in "debug" mode', () => {
    const component = shallow(<Provider {...store}><Register debug /></Provider>);
    expect(component).toMatchSnapshot();
  });
  it('should render correctly in "production" mode', () => {
    const component = shallow(<Provider {...store}><Register production /></Provider>);
    expect(component).toMatchSnapshot();
  });
});