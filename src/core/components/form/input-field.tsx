"use client";

import { FieldError, Input, Label, TextField } from "@heroui/react";
import { type ReactNode, useState } from "react";
import { type ControllerRenderProps, type FieldPath, type FieldValues } from "react-hook-form";

import { inputClassName } from "@/utils/const";
import { cn } from "@/utils/function";

type FieldProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> = {
  label: string;
  field: ControllerRenderProps<TFieldValues, TName>;
  readOnly?: boolean;
  isInvalid?: boolean;
  errorMessage?: string;
  placeholder?: string;
  isRequired?: boolean;
  type?: "text" | "email" | "password" | "tel" | "date";
  startContent?: ReactNode;
  endContent?: ReactNode;
};

const Field = <TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  label,
  field,
  readOnly = false,
  isInvalid,
  errorMessage,
  placeholder,
  type = "text",
  startContent,
  endContent,
  isRequired = false
}: FieldProps<TFieldValues, TName>): React.JSX.Element => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPasswordField = type === "password";
  const inputType = isPasswordField && isPasswordVisible ? "text" : type;

  const invalidInputClasses = isInvalid
    ? "border-destructive focus:border-destructive focus:ring-0 focus:outline-none focus-visible:outline-none"
    : "";

  const inputClassNameWithContent: string = cn(
    inputClassName,
    startContent ? "pl-10" : "pl-5",
    endContent ? "pr-10" : "pr-5",
    field.value && "border-gold/70",
    invalidInputClasses
  );

  return (
    <TextField
      isInvalid={isInvalid}
      isRequired={isRequired}
      name={field.name}
      id={field.name}
      type={inputType}
    >
      <Label className="font-medium text-[10px] uppercase tracking-[0.32em] text-gold/70 font-serif">
        {label}
      </Label>
      <div className="relative mt-1.5">
        {startContent ? (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gold/70">
            {startContent}
          </span>
        ) : null}

        <Input
          {...field}
          variant="secondary"
          placeholder={placeholder}
          readOnly={readOnly}
          className={inputClassNameWithContent}
          style={
            isInvalid
              ? {
                  outline: "none",
                  boxShadow: "0 0 0 1px #A63446, 0 0 18px -6px rgba(166,52,70,0.6)",
                  borderColor: "#A63446"
                }
              : undefined
          }
        />

        {endContent && isPasswordField ? (
          <button
            type="button"
            className="pointer-events-auto absolute right-3.5 top-1/2 -translate-y-1/2 text-gold/70"
            aria-label={isPasswordVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
            aria-pressed={isPasswordVisible}
            onClick={() => setIsPasswordVisible((currentValue) => !currentValue)}
          >
            {endContent}
          </button>
        ) : endContent ? (
          <span className="pointer-events-auto absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground">
            {endContent}
          </span>
        ) : null}
      </div>
      <FieldError className="animate-runes mt-1 flex items-center gap-2 text-xs text-destructive italic font-serif">
        <span className="inline-block h-1 w-1 rounded-full bg-destructive" />
        {errorMessage}
      </FieldError>
    </TextField>
  );
};

export default Field;
