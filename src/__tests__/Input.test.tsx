import React from 'react';
import { shallow } from 'enzyme';

import Input from '../Input';

describe('Input', () => {
  function setup<Props>(overrides?: Props) {
    const props = {
      value: 'controlled-value',
      onChange: jest.fn(),
      onFocus: jest.fn(),
      onInput: jest.fn(),
      onBlur: jest.fn(),
      ...overrides,
    };

    const output = shallow(<Input {...props} />);

    const simulate = {
      focus: () => output.simulate('focus'),
      blur: () => output.simulate('blur'),
      keypress: (key: string) => output.simulate('keyDown', { key }),
      input: (value: string) =>
        output.simulate('input', {
          currentTarget: { value },
        }),
    };

    return {
      output,
      props,
      simulate,
    };
  }

  it('defaults to controlled mode', () => {
    const { output, props } = setup();

    expect(output.prop('value')).toBe(props.value);
  });

  it('blindly forwards all input props', () => {
    const { output } = setup({ random: 'prop', extraneous: true });

    expect(output.prop('random')).toBe('prop');
    expect(output.prop('extraneous')).toBe(true);
  });

  it('emits change events', () => {
    const { simulate, props } = setup();

    simulate.focus();
    simulate.input('new conte');
    simulate.input('new conten');
    simulate.input('new content');
    simulate.blur();

    expect(props.onChange).toHaveBeenCalledTimes(1);
    expect(props.onChange).toHaveBeenCalledWith('new content');
  });

  it('emits native events', () => {
    const { simulate, props } = setup();

    simulate.focus();
    expect(props.onFocus).toHaveBeenCalled();

    simulate.input('content');
    expect(props.onInput).toHaveBeenCalled();

    simulate.blur();
    expect(props.onBlur).toHaveBeenCalled();
  });

  it('survives when events are omitted', () => {
    const { simulate } = setup({
      onFocus: undefined,
      onBlur: undefined,
      onKeyPress: undefined,
      onInput: undefined,
      onChange: undefined,
    });

    const events = () => {
      simulate.focus();
      simulate.keypress('k');
      simulate.input('bacon');
      simulate.blur();
    };

    expect(events).not.toThrow();
  });

  it('ignores changes if the new input matches props', () => {
    const { simulate, props } = setup();

    simulate.focus();
    simulate.input(props.value);
    simulate.blur();

    expect(props.onChange).not.toHaveBeenCalled();
  });

  it('uses state as the controlled value in edit mode', () => {
    const { simulate, output } = setup();

    simulate.focus();
    simulate.input('new content');

    expect(output.prop('value')).toBe('new content');
  });

  it('forks prop state on edit mode and reverts afterward', () => {
    const { simulate, output, props } = setup();

    simulate.focus();
    expect(output.prop('value')).toBe(props.value);

    simulate.input('new content');
    simulate.blur();
    expect(output.prop('value')).toBe(props.value);
  });

  it('emits a change event when you press enter', () => {
    const { simulate, props } = setup();

    simulate.focus();
    simulate.input('new content');

    simulate.keypress('a');
    expect(props.onChange).not.toHaveBeenCalled();

    simulate.keypress('Enter');
    expect(props.onChange).toHaveBeenCalledWith('new content');
  });
});
