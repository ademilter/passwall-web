import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import PassTitle from '../title';

describe('<PassTitle /> with no props', () => {
  let container: ShallowWrapper;

  beforeEach(() => {
    container = shallow(<PassTitle />);
  });

  it('should match the snapshot', () => {
    expect(container.html()).toMatchSnapshot();
  });

  it('should have logo', () => {
    expect(container.find('img[alt="Logo"]')).toBeTruthy();
  });
});
