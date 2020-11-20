import React, { InputHTMLAttributes } from 'react';

const noop = () => {};

export default class FreeformInput extends React.Component<Props, State> {
  static defaultProps = {
    onFocus: noop,
    onBlur: noop,
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
        value={this.state.mode === Mode.Active ? this.state.value : value}
      />
    );
  }

  enterEditMode = (event: React.FocusEvent<HTMLInputElement>) => {
    const snapshot =
      typeof this.props.value !== 'undefined' ? this.props.value : '';

    this.setState({ mode: Mode.Active, value: snapshot });
    this.props.onFocus!(event);
  };

  updateLocalSnapshot = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: event.currentTarget.value });
    this.props.onInput!(event);
  };

  exitEditMode = (event: React.FocusEvent<HTMLInputElement>) => {
    this.setState({ mode: Mode.Dormant });

    if (this.state.value !== this.props.value) {
      this.props.onChange!(this.state.value);
    }

    this.props.onBlur!(event);
  };
}

interface Props
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange?: (value: string) => void;
}

interface State {
  value: Props['value'];
  mode: Mode;
}

enum Mode {
  Active,
  Dormant,
}
