import React from "react";
import InputNumber from "../InputNumber";
import { ComponentStory } from '@storybook/react';

const props = {
  format: false,
  comma: false,
  value: '',
  disableNegative: false,
  formatOnlyBlur: false
}

export default {
  title: 'InputNumber',
  component: InputNumber,
  args: props
}

const Template: ComponentStory<typeof InputNumber> = args => {

  return <InputNumber { ...args } />

}

export const Default = Template.bind({});

export const Format = Template.bind({});
Format.args = {
  format: true
}

export const FormatComma = Template.bind({});
FormatComma.args = {
  format: true,
  comma: true
}

export const DisableNegative = Template.bind({});
DisableNegative.args = {
  disableNegative: true
}

export const FormatOnlyBlur = Template.bind({});
FormatOnlyBlur.args = {
  format: true,
  formatOnlyBlur: true
}

export const MaxLength = Template.bind({});
MaxLength.args = {
  format: true,
  maxLength: 6
}