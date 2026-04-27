/**
 * Tipos de cifra — placeholder até CV-004.
 * Evite lógica aqui; apenas contratos compartilhados.
 */
export type CipherId = string;

export interface CipherMetadata {
  id: CipherId;
  label: string;
}
