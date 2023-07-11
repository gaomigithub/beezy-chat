/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react/macro";
import { Input as AntInput, InputProps, InputRef } from "antd";
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

export type TextInputValueChangeTrigger = "onChange" | "onBlur" | "debounce";

export interface TextInputProps {
  className?: string;
  value?: string;
  placeholder?: string;
  forceValue?: boolean;
  autoComplete?: "on" | "off";
  maxLength?: number;
  readonly?: boolean;
  type?: InputProps["type"];
  disabled?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  allowClear?: boolean;
  autoFocus?: boolean;
  style?: React.CSSProperties;
  error?: boolean;
  valueChangeTrigger?: TextInputValueChangeTrigger;
  onValueChange?: (value: string) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const TextInput = React.memo(
  React.forwardRef<
    {
      focus: () => void;
      blur: () => void;
      select: () => void;
      input: HTMLInputElement | undefined;
    },
    TextInputProps
  >(function TextInput(props, ref) {
    const {
      className,
      forceValue,
      value,
      error,
      placeholder,
      maxLength,
      readonly,
      disabled,
      prefix,
      suffix,
      type,
      style,
      onValueChange,
      allowClear,
      valueChangeTrigger = "onChange",
      autoComplete,
      onBlur,
      onFocus,
      onKeyDown,
      autoFocus,
    } = props;

    const [internalValue, setInternalValue] = useState<string | undefined>("");
    const debounceTimeout = useRef<number | undefined>(undefined);

    useEffect(() => {
      setInternalValue(value);
    }, [value]);

    const handleOnChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setInternalValue(newValue);
        if (valueChangeTrigger === "onChange") {
          onValueChange?.(newValue);
        } else if (valueChangeTrigger === "debounce") {
          if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
          }
          debounceTimeout.current = window.setTimeout(() => {
            onValueChange?.(newValue);
          }, 400);
        }
      },
      [onValueChange, valueChangeTrigger]
    );

    const handleOnBlur = useCallback(
      (event: React.FocusEvent<HTMLInputElement>) => {
        if (valueChangeTrigger === "onBlur") {
          onValueChange?.(internalValue ?? "");
        }
        onBlur?.(event);
      },
      [valueChangeTrigger, onBlur, onValueChange, internalValue]
    );

    const antdInputRef = useRef<InputRef>(null);

    useImperativeHandle(
      ref,
      () => ({
        focus: () => {
          antdInputRef.current?.focus();
        },
        blur: () => {
          antdInputRef.current?.blur();
        },
        select: () => {
          antdInputRef.current?.select();
        },
        input: antdInputRef.current?.input ?? undefined,
      }),
      []
    );

    return (
      <AntInput
        ref={antdInputRef}
        css={[
          css`
            color: #3e434d;
            border-color: ${error ? "#e03200" : "#e4e9f2"};
            outline: 0;
            font-size: 12px;
            input {
              font-size: 12px;
            }
            input::placeholder,
            &::placeholder {
              font-size: 12px;
              color: #a3b1cc;
            }
            &:hover {
              border-color: ${error ? "#e03200" : "#3070f0"};
            }
            &:focus {
              border-color: ${error ? "#e03200" : "#3070f0"};
              box-shadow: 0 0 0 0;
            }
          `,

          css`
            height: 32px;
            line-height: 32px;
          `,
        ]}
        className={className}
        placeholder={placeholder}
        maxLength={maxLength}
        readOnly={readonly}
        disabled={disabled}
        prefix={prefix}
        type={type}
        suffix={suffix}
        style={style}
        value={forceValue ? value : internalValue}
        allowClear={allowClear}
        onChange={handleOnChange}
        autoComplete={autoComplete}
        onKeyDown={onKeyDown}
        onBlur={handleOnBlur}
        autoFocus={autoFocus}
        onFocus={onFocus}
      />
    );
  })
);
