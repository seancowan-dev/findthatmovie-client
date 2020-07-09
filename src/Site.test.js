import React from 'react';
import { shallow } from 'enzyme';
import Site from './Site';

describe('| Site Test Object |', () => {
  it('should render correctly in "debug" mode', () => {
    const component = shallow(<Site debug />);
    expect(component).toMatchSnapshot();
  });
  it('should render correctly in "production" mode', () => {
    const component = shallow(<Site production />);
    expect(component).toMatchSnapshot();
  });
});