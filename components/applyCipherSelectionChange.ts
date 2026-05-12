export type CipherParamsRecord = Record<string, unknown>;

export type CipherWorkspaceSelectionState = {
  selectedCipherId: string;
  cipherParams: CipherParamsRecord;
};

export function applyCipherSelectionChange(
  state: CipherWorkspaceSelectionState,
  nextCipherId: string,
): CipherWorkspaceSelectionState {
  if (nextCipherId === state.selectedCipherId) {
    return state;
  }

  return {
    selectedCipherId: nextCipherId,
    cipherParams: {},
  };
}
