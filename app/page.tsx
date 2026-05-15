import { CipherWorkspace } from "@/components/CipherWorkspace";

export default function Home() {
  return (
    <div className="min-h-screen min-w-0 bg-zinc-50 px-4 py-6 font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 sm:px-6 sm:py-8">
      <main className="mx-auto flex min-w-0 w-full max-w-5xl flex-col gap-6">
        <header className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Cypher Vault
          </h1>
          <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
            Codifique e decodifique mensagens em uma interface simples e
            responsiva.
          </p>
        </header>
        <CipherWorkspace />
      </main>
    </div>
  );
}
