import React from 'react';
import { shallow } from 'enzyme';

import Input from '../Input';

describe('Input', () => {
  function setup<Props>(overrides?: Props) {
    const props = {
      ...overrides,
    };

    const output = shallow(<Input {...props} />);

    return {
      output,
      props,
    };
  }

  it('renders', () => {
    expect(setup).not.toThrow();
  });
});
