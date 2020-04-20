import React from 'react';
import { shallow } from 'enzyme';
import Primary from './Primary';

describe('| Primary View Test Object |', () => {
  it('should render correctly in "debug" mode', () => {
    const component = shallow(<Primary debug />);
    expect(component).toMatchSnapshot();
  });
});