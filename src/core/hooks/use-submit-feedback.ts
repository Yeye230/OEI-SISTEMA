"use client";

import { useState } from "react";

type UseSubmitFeedbackReturn = {
  submitError: string | null;
  submitMessage: string | null;
  clearFeedback: () => void;
  setErrorMessage: (message: string) => void;
  setSuccessMessage: (message: string) => void;
};

const useSubmitFeedback = (): UseSubmitFeedbackReturn => {
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  return {
    submitError,
    submitMessage,
    clearFeedback: (): void => {
      setSubmitError(null);
      setSubmitMessage(null);
    },
    setErrorMessage: (message: string): void => {
      setSubmitMessage(null);
      setSubmitError(message);
    },
    setSuccessMessage: (message: string): void => {
      setSubmitError(null);
      setSubmitMessage(message);
    }
  };
};

export { useSubmitFeedback };
