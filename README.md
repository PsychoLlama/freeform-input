# React Freeform Input
A controlled `<input>` posing as an uncontrolled input.

## Install
```bash
$ yarn add freeform-input
```

## Purpose
React form controls fall in two categories:
[controlled](https://reactjs.org/docs/forms.html#controlled-components) and
[uncontrolled](https://reactjs.org/docs/uncontrolled-components.html). The
exact details are well documented elsewhere, but it doesn't matter, because
the dichotomy is a lie. You don't have to choose! There exists a perfect
middleground tradeoff, the Hybrid Controllable Input pattern.

An HCI behaves like a typical controlled input until it gains focus, then it
enters a freeform edit mode. Once the user is finished making changes,
a single change event is emitted and it snaps back to a declarative controlled
mode.

This is particularly useful with a centralized state management library like
Redux. You can sync your input state without needing a dispatch on every
keystroke, state changes won't wipe out your user's changes, and intermediate
edits don't violate validation rules.

## API
This library is functionally identical to `<input>` save for one exception: it
overrides `onChange`:

```ts
const [inputState, updateState] = useState('input value')

<FreeformInput
  value={inputState}
  onChange={updateState}
/>
```

The handler emits a value, **not an event**. This is due to a [limitation in
React](https://github.com/facebook/react/issues/9657) where they deviate from
browser behavior. React doesn't have a real `onChange` event.
