# React Input Number

Handle Input number with React. Support Material UI (MUI)

## Installation

```
# npm
npm i @kensoni/react-input-number

# Yarn
yarn add @kensoni/react-input-number
```

## Playground with storybook

```
git clone https://github.com/ngvcanh/react-input-number
cd react-input-number
yarn install
yarn start
```

[Live demo](https://ngvcanh.github.io/react-input-number)

## API

Using all `props` of `HTMLInputElement` without prop `type`. In addition, there are some additional props:

| Prop name | Type | Description |
|---|---|---|
| comma | _boolean_ | Format number with using `,` separate integer and decimal part. Only working when prop `format` is `true` |
| disableNegative | _boolean_ | Negative numbers are not allowed in input |
| format | _boolean_ | Enable format value for input |
| formatOnlyBlur | _boolean_ | Only format input number when focus out input |
| renderInput | _Function_ | Using for render another input if using third party library |
| value | _string_, _number_ | Default value for input number. Accept normal number, format number, format comma number |

## Render Input Function With Material UI (MUI)

```tsx
import { ChangeEvent, useState } from 'react';
import InputNumber from '@kensoni/react-input-number';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

export default function App(){

  const [ value, setValue ] = useState('');

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  }

  return <Box>
    <InputNumber 
      format
      value={ value }
      onChange={ onChange }
      renderInput={(inputProps, inputRef) => (
        <TextField fullWidth inputProps={ inputProps } inputRef={ inputRef } />
      )}
    />
    <Box component="pre" sx={{ mt: 3 }}>{ value }</Box>
  </Box>

}
```

Make sure that the properties from the function's inputProps are attached to the TextField's inputProps. Do not override this props on TextField props.

Each time the onChange event emit, the cursor will jump to the end of the input. In case of preserving the cursor position, make sure that the function's inputRef must be attached to the TextField's inputRef to hold the pointer.