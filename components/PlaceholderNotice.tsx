import type { CipherMetadata } from "@/types/cipher";

type PlaceholderNoticeProps = {
  /** Texto curto para smoke test de imports `@/components`. */
  title: string;
  /** Opcional: amarra `types/cipher` ao UI até as cifras existirem. */
  sampleCipher?: CipherMetadata;
};

export function PlaceholderNotice({
  title,
  sampleCipher,
}: PlaceholderNoticeProps) {
  return (
    <p className="max-w-md text-sm text-zinc-500 dark:text-zinc-500">
      {title}
      {sampleCipher ? (
        <>
          {" "}
          <span className="font-mono text-zinc-600 dark:text-zinc-400">
            ({sampleCipher.label} · {sampleCipher.id})
          </span>
        </>
      ) : null}
    </p>
  );
}
