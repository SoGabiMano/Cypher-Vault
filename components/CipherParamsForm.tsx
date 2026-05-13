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
  "w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:focus-visible:ring-zinc-500 sm:max-w-md";

function inputErrorClass(hasError: boolean): string {
  return hasError ? " border-red-500 dark:border-red-500" : "";
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
              className="rounded-xl border border-zinc-200 bg-zinc-50/80 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950/50"
              role="note"
              aria-label={field.label}
            >
              <p className="font-medium text-zinc-800 dark:text-zinc-200">{field.label}</p>
              <p className="mt-1 text-zinc-600 dark:text-zinc-400">{field.description}</p>
            </div>
          );
        }

        const fieldId = `${baseId}-${field.key}`;
        const fieldError = errors?.[field.key];

        if (field.kind === "number") {
          const raw = value[field.key];
          const display =
            raw === undefined || raw === null
              ? ""
              : typeof raw === "number" && Number.isFinite(raw)
                ? String(raw)
                : String(raw);
          const describedBy =
            field.description !== undefined ? `${fieldId}-desc` : undefined;

          return (
            <div key={field.key} className="flex flex-col gap-1">
              <label
                htmlFor={fieldId}
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                {field.label}
                {field.required ? (
                  <span className="text-red-600 dark:text-red-400"> *</span>
                ) : null}
              </label>
              {field.description !== undefined ? (
                <p id={`${fieldId}-desc`} className="text-xs text-zinc-500 dark:text-zinc-400">
                  {field.description}
                </p>
              ) : null}
              <input
                id={fieldId}
                type="number"
                aria-invalid={Boolean(fieldError)}
                aria-describedby={describedBy}
                required={field.required}
                min={field.min}
                max={field.max}
                step={field.integer === false ? "any" : "1"}
                value={display}
                onChange={(event) => {
                  const s = event.target.value;
                  if (s === "" || s === "-") {
                    onParamChange(field.key, undefined);
                    return;
                  }
                  const n = Number(s);
                  if (!Number.isFinite(n)) {
                    onParamChange(field.key, undefined);
                    return;
                  }
                  onParamChange(field.key, n);
                }}
                className={inputClassName + inputErrorClass(Boolean(fieldError))}
              />
              {fieldError !== undefined ? (
                <p className="text-xs text-red-600 dark:text-red-400" role="alert">
                  {fieldError}
                </p>
              ) : null}
            </div>
          );
        }

        const strVal = value[field.key];
        const strDisplay =
          strVal === undefined || strVal === null ? "" : String(strVal);
        const strDescribedBy =
          field.description !== undefined ? `${fieldId}-desc-str` : undefined;

        return (
          <div key={field.key} className="flex flex-col gap-1">
            <label
              htmlFor={fieldId}
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              {field.label}
              {field.required ? (
                <span className="text-red-600 dark:text-red-400"> *</span>
              ) : null}
            </label>
            {field.description !== undefined ? (
              <p id={`${fieldId}-desc-str`} className="text-xs text-zinc-500 dark:text-zinc-400">
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
              <p className="text-xs text-red-600 dark:text-red-400" role="alert">
                {fieldError}
              </p>
            ) : null}
          </div>
        );
      })}
      {errors?.["*"] !== undefined ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {errors["*"]}
        </p>
      ) : null}
    </div>
  );
}
