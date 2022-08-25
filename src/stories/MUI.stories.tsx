import { Story } from "@storybook/react";
import React, { ChangeEvent, useState } from "react";
import InputNumber from "../InputNumber";
import TextField from '@mui/material/TextField';

export default {
  title: 'Render Input/Material UI (MUI)'
}

const Template: Story = function DemoWithMUI(){

  const [ currentValue, setCurrentValue ] = useState('');
  const [ currentInteger, setCurrentInteger ] = useState('');

  const onChangeNumber = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentValue(e.target.value);
  }

  const onChangeInteger = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentInteger(e.target.value);
  }

  return <div>
    <p>Render input with Material UI (MUI)</p>
    <InputNumber
      format
      onChange={ onChangeNumber }
      value={ currentValue }
      renderInput={(inputProps, inputRef) => {
        return <TextField 
          label="Format"
          fullWidth
          inputProps={ inputProps }
          inputRef={ inputRef }
        />
      }}
    />
    <InputNumber
      format
      comma
      integer
      onChange={ onChangeInteger }
      value={ currentInteger }
      renderInput={(inputProps, inputRef) => {
        return <TextField 
          label="Format Comma and Integer"
          fullWidth
          sx={{ mt: 3 }}
          inputProps={ inputProps }
          inputRef={ inputRef }
        />
      }}
    />

    <pre>{ currentValue }</pre>
  </div>

}

export const Usage = Template.bind({});