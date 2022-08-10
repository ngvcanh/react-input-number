import {
  ChangeEvent,
  ClipboardEvent,
  DetailedHTMLProps,
  forwardRef,
  HTMLAttributes,
  KeyboardEvent,
  MutableRefObject,
  Ref,
  useEffect,
  useRef,
  useState
} from "react";
import useEmitControl from "@kensoni/react-hooks/useEmitControl";
import formatNumber from "./formatNumber";

export interface InputNumberProps 
  extends DetailedHTMLProps<HTMLAttributes<HTMLInputElement>, HTMLInputElement>{
    /**
     * Current value of input
     */
    value?: number;

    /**
     * Enable format number inside input
     */
    format?: boolean;

    /**
     * Use commas as separators between integer and decimal part
     */
    comma?: boolean;
  }

const onlyKeys = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.',
  'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Backspace'
];
  
const isPaste = (e: KeyboardEvent) => e.key === 'v' && e.ctrlKey;

const InputNumber = forwardRef(
  function InputNumber(props: InputNumberProps, ref: Ref<HTMLInputElement>){

    const {
      value,
      format,
      comma,
      onKeyDown,
      onPaste,
      onChange
    } = props;

    const inputRef = useRef<HTMLInputElement>(null);
    const [ currentValue, setCurrentValue ] = useState(value);
    const emitChangeInput = useEmitControl(inputRef);
    const addSeparator = useRef(false);

    useEffect(() => {
      value === currentValue || setCurrentValue(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ value ]);

    useEffect(() => {
      if (ref){
        (ref as MutableRefObject<HTMLInputElement>).current = inputRef.current!;
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onKeyDownInput = (e: KeyboardEvent<HTMLInputElement>) => {
      const { key } = e;

      if (!onlyKeys.includes(key) && !isPaste(e)){
        e.preventDefault();
        return;
      }

      if (key === '.'){
        addSeparator.current = !(currentValue?.toString().includes('.') ?? false);
      }
      else{
        addSeparator.current = false;
      }

      if (key === 'ArrowDown' || key === 'ArrowUp'){
        e.preventDefault();

        const preValue = key === 'ArrowDown' ? 1 : -1;
        const newValue = (currentValue ?? preValue) + (preValue * -1);

        onKeyDown && onKeyDown(e);
        emitChangeInput('change', newValue.toString());

        return;
      }
      
      onKeyDown && onKeyDown(e);
    }

    const onPasteInput = (e: ClipboardEvent<HTMLInputElement>) => {
      let data = e.clipboardData.getData('text');
      if (format && data){
        if (comma){
          data = data.replace(/\./g, '').replace(',', '.');
        }
        else{
          data = data.replace(/,/g, '');
        }
      }

      if (data && isNaN(parseFloat(data))){
        e.preventDefault();
        return;
      }

      onPaste && onPaste(e);
    }

    const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value;

      if (format && val){
        if (comma){
          val = val.replace(/\./g, '').replace(',', '.');
        }
        else{
          val = val.replace(/,/g, '');
        }
      }

      const _val = parseFloat(val);

      if (val && isNaN(_val)) {
        e.preventDefault();
        return;
      }

      setCurrentValue(val ? _val : undefined);
    
      e.target.value = _val.toString();
      onChange && onChange(e);
    }

    let inputValue = currentValue?.toString() ?? '';

    if (format && currentValue !== undefined){
      inputValue = formatNumber(currentValue, {
        comma
      });
    }

    if (addSeparator.current){
      inputValue += comma ? ',' : '.';
      addSeparator.current = false;
    }

    return <input
      ref={ inputRef }
      onKeyDown={ onKeyDownInput }
      onPaste={ onPasteInput }
      onChange={ onChangeInput }
      value={ inputValue }
    />

  }
);

export default InputNumber;