import React from 'react';
import { shallow } from 'enzyme';
import Icon from './index';

describe('RENDERING - Icon', () => {
  it('should render with default props', () => {
    const component = shallow(<Icon icon="test" />);
    expect(component).toMatchSnapshot();
  });
});
