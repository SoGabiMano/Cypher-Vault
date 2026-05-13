"use client";

import { CipherParamsForm } from "@/components/CipherParamsForm";
import { CipherSelector } from "@/components/CipherSelector";
import { applyCipherSelectionChange } from "@/components/applyCipherSelectionChange";
import { getAllCiphers, getCipherById } from "@/lib/ciphers";
import {
  isCipherValidationError,
  type CipherDefinition,
  type CipherParamsParseResult,
} from "@/types/cipher";
import { useMemo, useState, type ChangeEvent } from "react";

const ciphers = getAllCiphers();

function mockEncode(value: string) {
  return value.toUpperCase();
}

function mockDecode(value: string) {
  return value.toLowerCase();
}

function tryParseCipherParams(
  definition: CipherDefinition<unknown> | undefined,
  raw: Record<string, unknown>,
): { ok: true } | { ok: false; errors: Record<string, string> } {
  if (!definition?.parseParams) {
    return { ok: true };
  }
  try {
    const out = definition.parseParams(raw);
    if (out !== null && typeof out === "object" && "ok" in out) {
      const r = out as CipherParamsParseResult<unknown>;
      if (!r.ok) {
        const e = r.error;
        const field = e.field ?? "*";
        return { ok: false, errors: { [field]: e.message } };
      }
      return { ok: true };
    }
    return { ok: true };
  } catch (e) {
    if (isCipherValidationError(e)) {
      const field = e.field ?? "*";
      return { ok: false, errors: { [field]: e.message } };
    }
    throw e;
  }
}

export function CipherWorkspace() {
  const [selectedCipherId, setSelectedCipherId] = useState(
    () => ciphers[0]?.id ?? "",
  );
  const [cipherParams, setCipherParams] = useState<Record<string, unknown>>({});
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");

  const isSelectorDisabled = ciphers.length === 0;

  const selectedDefinition = useMemo(
    () => getCipherById(selectedCipherId),
    [selectedCipherId],
  );

  const { isParamsValid, paramErrors } = useMemo(() => {
    const result = tryParseCipherParams(selectedDefinition, cipherParams);
    return result.ok
      ? { isParamsValid: true as const, paramErrors: undefined }
      : { isParamsValid: false as const, paramErrors: result.errors };
  }, [selectedDefinition, cipherParams]);

  const isActionDisabled = inputText.trim().length === 0 || !isParamsValid;

  const handleCipherChange = (nextId: string) => {
    const next = applyCipherSelectionChange(
      { selectedCipherId, cipherParams },
      nextId,
    );
    setSelectedCipherId(next.selectedCipherId);
    setCipherParams(next.cipherParams);
  };

  const handleParamChange = (key: string, value: unknown) => {
    setCipherParams((prev) => {
      const next = { ...prev };
      if (value === undefined || value === "") {
        delete next[key];
      } else {
        next[key] = value;
      }
      return next;
    });
  };

  const handleEncode = () => {
    setOutputText(mockEncode(inputText));
  };

  const handleDecode = () => {
    setOutputText(mockDecode(inputText));
  };

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const next = event.target.value;
    setInputText(next);
    if (next.trim().length === 0) {
      setOutputText("");
    }
  };

  const paramFields = selectedDefinition?.paramFields ?? [];

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
      <div className="mb-4 flex flex-col gap-4">
        <CipherSelector
          ciphers={ciphers}
          value={selectedCipherId}
          onChange={handleCipherChange}
          disabled={isSelectorDisabled}
        />
        {paramFields.length > 0 ? (
          <CipherParamsForm
            paramFields={paramFields}
            value={cipherParams}
            onParamChange={handleParamChange}
            errors={paramErrors}
          />
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="cipher-input"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Texto de entrada
          </label>
          <textarea
            id="cipher-input"
            value={inputText}
            onChange={handleInputChange}
            placeholder="Digite o texto para codificar ou decodificar..."
            className="min-h-44 w-full resize-y rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:focus-visible:ring-zinc-500"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="cipher-output"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Resultado
          </label>
          <textarea
            id="cipher-output"
            value={outputText}
            readOnly
            aria-live="polite"
            aria-atomic="true"
            placeholder="O resultado aparecerá aqui."
            className="min-h-44 w-full resize-y rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:focus-visible:ring-zinc-500"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleEncode}
          disabled={isActionDisabled}
          className="inline-flex w-full items-center justify-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 sm:w-auto"
        >
          Codificar
        </button>
        <button
          type="button"
          onClick={handleDecode}
          disabled={isActionDisabled}
          className="inline-flex w-full items-center justify-center rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 sm:w-auto"
        >
          Decodificar
        </button>
      </div>
    </section>
  );
}
