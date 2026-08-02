import { useCallback, useState } from "react";

export interface FieldRule<T> {
  field: keyof T & string;
  message: string;
  test: (value: T) => boolean;
}

export interface FieldError {
  field: string;
  message: string;
}

/** Evalúa las reglas contra `values` y devuelve los campos que fallan, en el
 *  orden en que se declararon las reglas (CA-06.2). Pura — testeable sin DOM. */
export function requiredFields<T>(values: T, rules: FieldRule<T>[]): FieldError[] {
  return rules
    .filter((rule) => !rule.test(values))
    .map((rule) => ({ field: rule.field, message: rule.message }));
}

/** Estado de errores de un formulario + `validate` que evalúa reglas y guarda
 *  el mapa `field → message`. Devuelve la lista de fallos para que el llamador
 *  decida abortar y mover el foco (CA-06.1). */
export function useFieldErrors() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback(function <T>(values: T, rules: FieldRule<T>[]): FieldError[] {
    const errs = requiredFields(values, rules);
    setErrors(Object.fromEntries(errs.map((e) => [e.field, e.message])));
    return errs;
  }, []);

  const clear = useCallback(() => setErrors({}), []);

  return { errors, validate, clear };
}

/** Props ARIA para un campo: `aria-invalid` + `aria-describedby` apuntando al
 *  mensaje de error (cuyo id sigue la convención `${field}-err`). Sin error,
 *  no añade nada. */
export function fieldAria(field: string, errors: Record<string, string>) {
  return errors[field]
    ? { "aria-invalid": true as const, "aria-describedby": `${field}-err` }
    : {};
}
