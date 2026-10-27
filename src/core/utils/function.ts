import { toast } from "@heroui/react";
import clsx, { ClassValue } from "clsx";
import crypto from "crypto-js";
import { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { REGISTER_FALLBACK_ERROR } from '../server/messages';

type SubmitFeedbackErrorOptions = {
  showToast?: boolean;
};

export const encrypt = (plainText: string): string =>
  crypto.AES.encrypt(plainText, process.env.NEXT_PUBLIC_PLAIN_TEXT as string).toString();

export const encryptPayload = (payload: Record<string, string>): Record<string, string> =>
  Object.fromEntries(
    Object.entries(payload).map(([property, value]) => [encrypt(property), encrypt(value)])
  );

export const submitFeedbackError = <TFieldValues extends FieldValues>(
  setError: UseFormSetError<TFieldValues>,
  message?: string,
  errors?: string[] | undefined,
  options?: SubmitFeedbackErrorOptions
): void => {
  const errorMessage = message ?? REGISTER_FALLBACK_ERROR;

  setError("root.server" as Path<TFieldValues>, {
    type: "server",
    message: errorMessage,
    types: {
      items: errors
    }
  });

  if (options?.showToast) {
    toast.danger(errorMessage);
  }
};

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));
