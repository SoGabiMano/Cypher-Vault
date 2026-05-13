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
        className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        Cifra
      </label>
      <select
        id={selectId}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:focus-visible:ring-zinc-500 sm:max-w-md"
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
