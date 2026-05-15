"use client";

import type { CipherMetadata } from "@/types/cipher";
import { useId, type ChangeEvent } from "react";

type CipherSelectorProps = {
  ciphers: readonly CipherMetadata[];
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
  selectId?: string;
};

export function CipherSelector({
  ciphers,
  value,
  onChange,
  disabled = false,
  selectId: selectIdProp,
}: CipherSelectorProps) {
  const generatedId = useId();
  const selectId = selectIdProp ?? generatedId;
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={selectId}
        className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
      >
        Cifra
      </label>
      <select
        id={selectId}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className="min-h-11 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100 dark:focus-visible:ring-zinc-300 dark:focus-visible:ring-offset-zinc-900 sm:max-w-md"
      >
        {ciphers.map((cipher) => (
          <option key={cipher.id} value={cipher.id}>
            {cipher.name}
          </option>
        ))}
      </select>
    </div>
  );
}
