"use client";

import type { CipherParamField } from "@/types/cipher";
import { useId } from "react";

export type CipherParamsFormProps = {
  paramFields: readonly CipherParamField[];
  value: Record<string, unknown>;
  onParamChange: (key: string, value: unknown) => void;
  errors?: Record<string, string>;
};

const inputClassName =
  "min-h-11 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100 dark:focus-visible:ring-zinc-300 dark:focus-visible:ring-offset-zinc-900 sm:max-w-md";

function inputErrorClass(hasError: boolean): string {
  return hasError ? " border-red-500 dark:border-red-500" : "";
}

/** Lista ids para `aria-describedby` (descrição + erro); omitir atributo se vazio. */
function ariaDescribedByIds(...ids: (string | undefined)[]): string | undefined {
  const parts = ids.filter((id): id is string => id !== undefined && id.length > 0);
  return parts.length > 0 ? parts.join(" ") : undefined;
}

export function CipherParamsForm({
  paramFields,
  value,
  onParamChange,
  errors,
}: CipherParamsFormProps) {
  const baseId = useId();

  return (
    <div className="flex flex-col gap-4">
      {paramFields.map((field) => {
        if (field.kind === "help") {
          return (
            <div
              key={field.key}
              className="rounded-xl border border-zinc-300 bg-zinc-50/90 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950/80"
              role="note"
              aria-label={field.label}
            >
              <p className="font-medium text-zinc-800 dark:text-zinc-200">{field.label}</p>
              <p className="mt-1 text-zinc-700 dark:text-zinc-300">{field.description}</p>
            </div>
          );
        }

        const fieldId = `${baseId}-${field.key}`;
        const fieldError = errors?.[field.key];

        if (field.kind === "number") {
          const raw = value[field.key];
          const isDraftString = typeof raw === "string";
          const display =
            raw === undefined || raw === null
              ? ""
              : typeof raw === "number" && Number.isFinite(raw)
                ? String(raw)
                : String(raw);
          const describedBy = ariaDescribedByIds(
            field.description !== undefined ? `${fieldId}-desc` : undefined,
            fieldError !== undefined ? `${fieldId}-err` : undefined,
          );

          return (
            <div key={field.key} className="flex flex-col gap-1">
              <label
                htmlFor={fieldId}
                className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
              >
                {field.label}
                {field.required ? (
                  <span className="text-red-700 dark:text-red-300"> *</span>
                ) : null}
              </label>
              {field.description !== undefined ? (
                <p id={`${fieldId}-desc`} className="text-xs text-zinc-600 dark:text-zinc-300">
                  {field.description}
                </p>
              ) : null}
              <input
                id={fieldId}
                type={isDraftString ? "text" : "number"}
                inputMode={
                  isDraftString ? (field.integer === false ? "decimal" : "numeric") : undefined
                }
                aria-invalid={Boolean(fieldError)}
                aria-describedby={describedBy}
                required={field.required}
                min={isDraftString ? undefined : field.min}
                max={isDraftString ? undefined : field.max}
                step={isDraftString ? undefined : field.integer === false ? "any" : "1"}
                value={display}
                onChange={(event) => {
                  const s = event.target.value;
                  if (s === "") {
                    onParamChange(field.key, undefined);
                    return;
                  }
                  const n = Number(s);
                  if (Number.isFinite(n)) {
                    onParamChange(field.key, n);
                    return;
                  }
                  onParamChange(field.key, s);
                }}
                className={inputClassName + inputErrorClass(Boolean(fieldError))}
              />
              {fieldError !== undefined ? (
                <p
                  id={`${fieldId}-err`}
                  className="text-xs text-red-800 dark:text-red-300"
                  aria-live="polite"
                >
                  {fieldError}
                </p>
              ) : null}
            </div>
          );
        }

        const strVal = value[field.key];
        const strDisplay =
          strVal === undefined || strVal === null ? "" : String(strVal);
        const strDescribedBy = ariaDescribedByIds(
          field.description !== undefined ? `${fieldId}-desc-str` : undefined,
          fieldError !== undefined ? `${fieldId}-err` : undefined,
        );

        return (
          <div key={field.key} className="flex flex-col gap-1">
            <label
              htmlFor={fieldId}
              className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
            >
              {field.label}
              {field.required ? (
                <span className="text-red-700 dark:text-red-300"> *</span>
              ) : null}
            </label>
            {field.description !== undefined ? (
              <p id={`${fieldId}-desc-str`} className="text-xs text-zinc-600 dark:text-zinc-300">
                {field.description}
              </p>
            ) : null}
            <input
              id={fieldId}
              type="text"
              aria-invalid={Boolean(fieldError)}
              aria-describedby={strDescribedBy}
              required={field.required}
              maxLength={field.maxLength}
              value={strDisplay}
              onChange={(event) => {
                const v = event.target.value;
                onParamChange(field.key, v === "" ? undefined : v);
              }}
              className={inputClassName + inputErrorClass(Boolean(fieldError))}
            />
            {fieldError !== undefined ? (
              <p
                id={`${fieldId}-err`}
                className="text-xs text-red-800 dark:text-red-300"
                aria-live="polite"
              >
                {fieldError}
              </p>
            ) : null}
          </div>
        );
      })}
      {errors?.["*"] !== undefined ? (
        <p className="text-sm text-red-800 dark:text-red-300" role="alert" aria-live="polite">
          {errors["*"]}
        </p>
      ) : null}
    </div>
  );
}
