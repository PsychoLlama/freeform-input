import React, { InputHTMLAttributes } from 'react';

const noop = () => {};

export default class FreeformInput extends React.Component<Props, State> {
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
    const { value, onChange, ...props } = this.props;

    return (
      <input
        {...props}
        onFocus={this.enterEditMode}
        onInput={this.updateLocalSnapshot}
        onBlur={this.exitEditMode}
        onKeyDown={this.detectSubmission}
        value={this.state.mode === Mode.Active ? this.state.value : value}
      />
    );
  }

  enterEditMode = (event: React.FocusEvent<HTMLInputElement>) => {
    this.setState({ mode: Mode.Active, value: this.props.value });
    this.props.onFocus!(event);
  };

  updateLocalSnapshot = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: event.currentTarget.value });
    this.props.onInput!(event);
  };

  exitEditMode = (event: React.FocusEvent<HTMLInputElement>) => {
    this.setState({ mode: Mode.Dormant });
    this.submit();

    this.props.onBlur!(event);
  };

  detectSubmission = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') this.submit();
    this.props.onKeyPress!(event);
  };

  submit = () => {
    const { value } = this.state;

    if (this.props.value !== value) {
      this.props.onChange!(value);
    }
  };
}

interface Props
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  onChange?: (value: string) => void;
  value: number | string;
}

interface State {
  value: Props['value'];
  mode: Mode;
}

enum Mode {
  Active,
  Dormant,
}
