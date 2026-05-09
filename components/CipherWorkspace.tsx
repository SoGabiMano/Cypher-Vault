"use client";

import { useState } from "react";

function mockEncode(value: string) {
  return value.toUpperCase();
}

function mockDecode(value: string) {
  return value.toLowerCase();
}

export function CipherWorkspace() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");

  const isActionDisabled = inputText.trim().length === 0;

  const handleEncode = () => {
    setOutputText(mockEncode(inputText));
  };

  const handleDecode = () => {
    setOutputText(mockDecode(inputText));
  };

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
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
            onChange={(event) => setInputText(event.target.value)}
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
