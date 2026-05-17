"use client";

import { CipherParamsForm } from "@/components/CipherParamsForm";
import { CipherSelector } from "@/components/CipherSelector";
import { applyCipherSelectionChange } from "@/components/applyCipherSelectionChange";
import { getCipherById, getCiphersForSelector } from "@/lib/ciphers";
import { formatCipherError } from "@/lib/formatCipherError";
import { tryParseCipherParams } from "@/lib/tryParseCipherParams";
import { useMemo, useState, type ChangeEvent } from "react";

const selectorCiphers = getCiphersForSelector();

export function CipherWorkspace() {
  const [selectedCipherId, setSelectedCipherId] = useState(
    () => selectorCiphers[0]?.id ?? "",
  );
  const [cipherParams, setCipherParams] = useState<Record<string, unknown>>({});
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [transformError, setTransformError] = useState<string | undefined>();

  const isSelectorDisabled = selectorCiphers.length === 0;

  const selectedDefinition = useMemo(
    () => getCipherById(selectedCipherId),
    [selectedCipherId],
  );

  const { isParamsValid, paramErrors, parsedParams } = useMemo(() => {
    const result = tryParseCipherParams(selectedDefinition, cipherParams);
    if (!result.ok) {
      return {
        isParamsValid: false as const,
        paramErrors: result.errors,
        parsedParams: undefined,
      };
    }
    return {
      isParamsValid: true as const,
      paramErrors: undefined,
      parsedParams: result.params,
    };
  }, [selectedDefinition, cipherParams]);

  const isActionDisabled = inputText.trim().length === 0 || !isParamsValid;

  const handleCipherChange = (nextId: string) => {
    const next = applyCipherSelectionChange(
      { selectedCipherId, cipherParams },
      nextId,
    );
    setSelectedCipherId(next.selectedCipherId);
    setCipherParams(next.cipherParams);
    setTransformError(undefined);
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
    setTransformError(undefined);
  };

  const runTransform = (direction: "encode" | "decode") => {
    if (!selectedDefinition) return;
    setTransformError(undefined);
    try {
      const out =
        direction === "encode"
          ? selectedDefinition.encode(inputText, parsedParams)
          : selectedDefinition.decode(inputText, parsedParams);
      setOutputText(out);
    } catch (e) {
      setOutputText("");
      setTransformError(formatCipherError(e));
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const next = event.target.value;
    setInputText(next);
    setTransformError(undefined);
    if (next.trim().length === 0) {
      setOutputText("");
    }
  };

  const paramFields = selectedDefinition?.paramFields ?? [];

  return (
    <section className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
      <div className="mb-4 flex flex-col gap-4">
        <CipherSelector
          ciphers={selectorCiphers}
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

      {transformError !== undefined ? (
        <p
          className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100"
          role="alert"
          aria-live="assertive"
        >
          {transformError}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="cipher-input"
            className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
          >
            Texto de entrada
          </label>
          <textarea
            id="cipher-input"
            value={inputText}
            onChange={handleInputChange}
            placeholder="Digite o texto para codificar ou decodificar..."
            className="min-h-44 w-full min-w-0 resize-y rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100 dark:focus-visible:ring-zinc-300 dark:focus-visible:ring-offset-zinc-900"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="cipher-output"
            className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
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
            className="min-h-44 w-full min-w-0 resize-y rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100 dark:focus-visible:ring-zinc-300 dark:focus-visible:ring-offset-zinc-900"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => runTransform("encode")}
          disabled={isActionDisabled}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 dark:focus-visible:ring-zinc-300 dark:focus-visible:ring-offset-zinc-900 sm:w-auto"
        >
          Codificar
        </button>
        <button
          type="button"
          onClick={() => runTransform("decode")}
          disabled={isActionDisabled}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 dark:focus-visible:ring-zinc-300 dark:focus-visible:ring-offset-zinc-900 sm:w-auto"
        >
          Decodificar
        </button>
      </div>
    </section>
  );
}
