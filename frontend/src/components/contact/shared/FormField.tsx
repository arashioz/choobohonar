import { cn } from "@/lib/utils";
import { fieldClass } from "@/lib/form-utils";

type BaseProps = {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
};

type InputProps = BaseProps & {
  type?: "text" | "tel" | "email" | "number";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  dir?: "rtl" | "ltr";
};

type TextareaProps = BaseProps & {
  as: "textarea";
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
};

type SelectProps = BaseProps & {
  as: "select";
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
};

type RadioGroupProps = BaseProps & {
  as: "radio";
  value: string;
  onChange: (value: string) => void;
  options: string[];
};

export type FormFieldProps = InputProps | TextareaProps | SelectProps | RadioGroupProps;

export default function FormField(props: FormFieldProps) {
  const { label, name, required, error, hint, className } = props;

  return (
    <div className={cn("flex flex-col", className)}>
      <label htmlFor={name} className="mb-2 text-sm text-forest/70">
        {label}
        {required ? <span className="text-brick"> *</span> : null}
      </label>

      {"as" in props && props.as === "textarea" ? (
        <textarea
          id={name}
          name={name}
          rows={props.rows ?? 4}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          placeholder={props.placeholder}
          className={fieldClass(Boolean(error))}
        />
      ) : "as" in props && props.as === "select" ? (
        <select
          id={name}
          name={name}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          className={fieldClass(Boolean(error))}
        >
          <option value="">{props.placeholder ?? "انتخاب کنید"}</option>
          {props.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : "as" in props && props.as === "radio" ? (
        <div className="flex flex-wrap gap-4 pt-1">
          {props.options.map((opt) => (
            <label key={opt} className="inline-flex cursor-pointer items-center gap-2 text-sm text-forest/80">
              <input
                type="radio"
                name={name}
                value={opt}
                checked={props.value === opt}
                onChange={() => props.onChange(opt)}
                className="h-4 w-4 accent-forest"
              />
              {opt}
            </label>
          ))}
        </div>
      ) : (
        <input
          id={name}
          name={name}
          type={props.type ?? "text"}
          dir={props.dir ?? (props.type === "tel" || props.type === "email" ? "ltr" : "rtl")}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          placeholder={props.placeholder}
          className={cn(fieldClass(Boolean(error)), props.type === "tel" && "text-right")}
        />
      )}

      {hint && !error ? <span className="mt-1.5 text-xs text-forest/50">{hint}</span> : null}
      {error ? <span className="mt-1.5 text-xs text-brick">{error}</span> : null}
    </div>
  );
}
