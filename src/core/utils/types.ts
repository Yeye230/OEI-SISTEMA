import { Key } from "@heroui/react";
import { FieldErrors, FieldValues, UseFormHandleSubmit, UseFormReturn } from "react-hook-form";

export type AutoCompleteOption = {
  id: Key;
  img: string;
  name: string;
};

export type RadioOption = {
  title: string;
  icon?: string;
  emoji?: string;
  value: string;
  description?: string;
};

export type UseFormReturnValues<TValues extends FieldValues> = {
  control: UseFormReturn<TValues>["control"];
  handleSubmit: UseFormHandleSubmit<TValues>;
  onSubmit: (values: TValues) => Promise<void>;
  isSubmitting: boolean;
  errors: FieldErrors<TValues>;
};
