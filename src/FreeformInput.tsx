import type {
  FocusEvent,
  ChangeEvent,
  KeyboardEvent,
  InputHTMLAttributes,
} from 'react';
import React, { Component, forwardRef } from 'react';

const noop = () => {};

class FreeformInput extends Component<Props, State> {
  static defaultProps = {
    onFocus: noop,
    onBlur: noop,
    onKeyPress: noop,
    onChange: noop,
    onInput: noop,
  };

  state = {
    value: '',
    mode: Mode.Dormant,
  };

  render() {
    const { value, onChange, __inputRef, ...props } = this.props;

    return (
      <input
        {...props}
        onFocus={this.enterEditMode}
        onInput={this.updateLocalSnapshot}
        onBlur={this.exitEditMode}
        onKeyDown={this.detectSubmission}
        value={this.state.mode === Mode.Active ? this.state.value : value}
        ref={__inputRef}
      />
    );
  }

  enterEditMode = (event: FocusEvent<HTMLInputElement>) => {
    this.setState({ mode: Mode.Active, value: this.props.value });
    this.props.onFocus!(event);
  };

  updateLocalSnapshot = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: event.currentTarget.value });
    this.props.onInput!(event);
  };

  exitEditMode = (event: FocusEvent<HTMLInputElement>) => {
    this.setState({ mode: Mode.Dormant });
    this.submit();

    this.props.onBlur!(event);
  };

  detectSubmission = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') this.submit();
    this.props.onKeyPress!(event);
  };

  submit = () => {
    this.props.onChange!(this.state.value);
  };
}

interface Props
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  onChange?: (value: string) => void;
  value: number | string;
  __inputRef: React.Ref<HTMLInputElement>;
}

interface State {
  value: Props['value'];
  mode: Mode;
}

enum Mode {
  Active,
  Dormant,
}

export default forwardRef(
  (props: Omit<Props, '__inputRef'>, ref: React.Ref<HTMLInputElement>) => (
    <FreeformInput {...props} __inputRef={ref} />
  ),
);
