import { Story } from "@storybook/react";
import React, { ChangeEvent, useState } from "react";
import InputNumber from "../InputNumber";
import TextField from '@mui/material/TextField';

export default {
  title: 'Render Input/Material UI (MUI)'
}

const Template: Story = () => {

  const [ currentValue, setCurrentValue ] = useState('');

  const onChangeNumber = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentValue(e.target.value);
  }

  return <div>
    <p>Render input with Material UI (MUI)</p>
    <InputNumber
      format
      onChange={ onChangeNumber }
      renderInput={(inputProps, inputRef) => {
        return <TextField 
          inputProps={ inputProps }
          inputRef={ inputRef }
        />
      }}
    />

    <pre>{ currentValue }</pre>
  </div>

}

export const Usage = Template.bind({});