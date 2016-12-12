import { expect } from 'chai';
import React from 'react';
import index from '../lib/index';
import { shallow, mount, render } from 'enzyme';
require('locus');

describe('<WelcomePage />', () => {
  it('should have a prop of location', () => {
    const title = 'test location';
    const wrapper = shallow(<WelcomePage location={location}/>);
    expect(wrapper.contains(location)).to.equal(true);
  });
