import { Message } from "react-hook-form";

type FormErrorProps = {
  server:
    | Partial<{
        type: string | number;
        message: Message;
      }>
    | undefined;
};

export const FormError = ({ server }: FormErrorProps): React.JSX.Element | null => {
  const rootServerError = server as
    | {
        message?: string;
        types?: {
          items?: string[];
        };
      }
    | undefined;
  const serverErrorItems = rootServerError?.types?.items;
  const serverErrors = Array.isArray(serverErrorItems) ? serverErrorItems : [];

  if (serverErrors.length === 0) return null;

  return (
    <ul className="mt-4 space-y-1 text-sm text-status-error-text">
      {serverErrors.map((error) => (
        <li key={String(error)}>{error}</li>
      ))}
    </ul>
  );
};
