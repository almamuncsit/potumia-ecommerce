import { useId } from "react";

type Props = {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  defaultValue?: string;
  error?: string;
  textarea?: boolean;
  minLength?: number;
  hint?: string;
};

/** Labelled input with its error message tied to it for screen readers */
export function Field({ label, name, type = "text", autoComplete, required, defaultValue, error, textarea, minLength, hint }: Props) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  const common = {
    id,
    name,
    required,
    defaultValue,
    autoComplete,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    className: `field ${error ? "border-danger" : ""}`,
  };

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium">{label}</label>
      {textarea ? <textarea rows={3} {...common} /> : <input type={type} minLength={minLength} {...common} />}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-danger">{error}</p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}
