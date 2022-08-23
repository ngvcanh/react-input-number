import {
  ChangeEvent,
  ClipboardEvent,
  DetailedHTMLProps,
  FocusEvent,
  forwardRef,
  InputHTMLAttributes,
  KeyboardEvent,
  MutableRefObject,
  ReactElement,
  Ref,
  useEffect,
  useRef,
  useState
} from "react";
import { existSep, isCommandKey, isWhiteKeys, revertByChange } from "./utils";
import BigNumber from "@kensoni/big-number";
import useEmitControl from "@kensoni/react-hooks/useEmitControl";
import useForceUpdate from "@kensoni/react-hooks/useForceUpdate";

export interface InputNumberBaseProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>{}

export interface InputNumberProps extends InputNumberBaseProps{
  /**
   * Current value of input
   */
  value?: string | number;

  /**
   * Enable format number inside input
   */
  format?: boolean;

  /**
   * Use commas as separators between integer and decimal part
   */
  comma?: boolean;

  /**
   * Disable press key `-` on keyboard and paste event
   */
  disableNegative?: boolean;

  /**
   * Only format value of input when pointer focus out input
   */
  formatOnlyBlur?: boolean;

  /**
   * Function get the JSX Element for render input
   */
  renderInput?(props: InputNumberBaseProps, ref: Ref<unknown>): ReactElement;
}
  
const InputNumber = forwardRef(
  function InputNumber(props: InputNumberProps, ref: Ref<HTMLInputElement>){

    const {
      value,
      format,
      comma,
      disableNegative,
      defaultValue,
      formatOnlyBlur,
      onKeyDown,
      onPaste,
      onChange,
      onFocus,
      onBlur,
      renderInput,
      ...rest
    } = props;

    const opt = useRef({ comma })
    const focus = useRef(false);
    const cursor = useRef<number | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const shouldUpdate = useRef(false);

    const emitChangeInput = useEmitControl(inputRef);
    const forceUpdate = useForceUpdate();

    const [ currentValue, setCurrentValue ] = useState(new BigNumber(value ?? '', opt.current));

    useEffect(() => {
      const newBig = new BigNumber(value ?? '', opt.current);
      newBig.value === currentValue.value || setCurrentValue(newBig);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ value ]);

    useEffect(() => {
      if (ref){
        if (typeof ref === 'function'){
          ref(inputRef.current);
        }
        else{
          (ref as MutableRefObject<HTMLInputElement>).current = inputRef.current!;
        }
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      const input = inputRef.current;
      input && input.setSelectionRange(cursor.current, cursor.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ currentValue, value, inputRef, cursor ]);

    const onKeyDownInput = (e: KeyboardEvent<HTMLInputElement>) => {
      const { key } = e, isNotCommand = !isCommandKey(e);

      if (
        (!isWhiteKeys(key, currentValue, comma, disableNegative) && isNotCommand) 
        || existSep(key, currentValue, comma)
      ){
        e.preventDefault();
        return;
      }

      if (key === 'ArrowDown' || key === 'ArrowUp'){
        e.preventDefault();
        const newValue = currentValue.add(new BigNumber(key === 'ArrowDown' ? -1 : 1))

        onKeyDown && onKeyDown(e);
        emitChangeInput('change', newValue.formatValue);

        return;
      }
      
      cursor.current = ((e.target as HTMLInputElement).selectionStart ?? 0);
      if (isNotCommand) cursor.current = cursor.current + 1;

      shouldUpdate.current = true;
      onKeyDown && onKeyDown(e);
    }

    const onPasteInput = (e: ClipboardEvent<HTMLInputElement>) => {
      const clipboardValue = BigNumber.from(e.clipboardData.getData('text').trim(), opt.current).abs();
      const { value, selectionStart, selectionEnd } = e.target as HTMLInputElement;

      const first = value.substring(0, selectionStart ?? 0);
      const last = value.substring(selectionEnd ?? 0);

      let valClip = clipboardValue.toString();

      if (value.includes(format && comma ? ',' : '.')){
        valClip = `${ clipboardValue.int }${ clipboardValue.dec }`;
      }

      const val = `${ first }${ valClip }${ last }`;

      if (val === ''){
        e.preventDefault();
        return;
      }

      const sepLenth = Math.floor(BigNumber.from(valClip).int.length / 3);
      cursor.current = (cursor.current ?? 0) + valClip.length + sepLenth - 1;

      e.clipboardData.setData('text/plain', valClip);
      onPaste && onPaste(e);
    }

    const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
      const originVal = e.target.value
      , val = revertByChange(originVal, comma)
      , newValue = new BigNumber(val, opt.current);

      e.target.value = newValue.toString();

      if ((cursor.current ?? 0) === originVal.length){
        cursor.current = newValue.formatValue.length;
      }

      if (format && !formatOnlyBlur){
        const dec = comma ? ',' : '.', sep = RegExp(`\\${ comma ? '.' : ',' }`, 'g');
        const oldLength = BigNumber.from(currentValue.toString().split(dec)[0]).formatValue.split(',').length;
        const newLength = BigNumber.from(originVal.split(dec)[0].replace(sep, '')).formatValue.split(',').length;
        const { current } = cursor;

        if (typeof current === 'number' && current > 0 && oldLength < newLength){
          cursor.current = current + 1;
        }
      }

      setCurrentValue(newValue);
      onChange && onChange(e);
    }

    const onFocusInput = (e: FocusEvent<HTMLInputElement>) => {
      focus.current = true;
      onFocus && onFocus(e);
      format && forceUpdate();
    }

    const onBlurInput = (e: FocusEvent<HTMLInputElement>) => {
      focus.current = false;
      onBlur && onBlur(e);
      
      if (format && formatOnlyBlur && shouldUpdate.current){
        shouldUpdate.current = false;
        forceUpdate();
      }
    }

    let inputValue = currentValue.value;
    if (format && (!formatOnlyBlur || !focus.current)) inputValue = currentValue.formatValue;

    const renderProps: InputNumberBaseProps = {
      onKeyDown: onKeyDownInput,
      onPaste: onPasteInput,
      onChange: onChangeInput,
      onFocus: onFocusInput,
      onBlur: onBlurInput,
      value: inputValue,
      type: 'text',
    }

    if (renderInput) return renderInput(renderProps, inputRef);
    return <input { ...rest } { ...renderProps } ref={ inputRef } />

  }
);

export default InputNumber;