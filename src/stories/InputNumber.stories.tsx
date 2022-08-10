import React from "react";
import InputNumber from "../InputNumber";
import { ComponentStory } from '@storybook/react';

export default {
  title: 'InputNumber',
  component: InputNumber
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