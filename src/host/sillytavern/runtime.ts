export interface SillyTavernMessageVariableTarget {
  type: 'message';
  message_id: number;
}

export interface SillyTavernRuntime {
  getLastMessageId(): number;
  getVariables(
    target: SillyTavernMessageVariableTarget,
  ): Record<string, unknown>;
  getMvuData?(
    target: SillyTavernMessageVariableTarget,
  ): Record<string, unknown> | undefined;
}

interface SillyTavernGlobalLike {
  getLastMessageId?: () => number;
  getVariables?: (
    target: SillyTavernMessageVariableTarget,
  ) => Record<string, unknown>;
  Mvu?: {
    getMvuData?: (
      target: SillyTavernMessageVariableTarget,
    ) => Record<string, unknown> | undefined;
  };
}

export function createGlobalSillyTavernRuntime(): SillyTavernRuntime {
  const runtime = globalThis as unknown as SillyTavernGlobalLike;

  if (typeof runtime.getLastMessageId !== 'function') {
    throw new Error('SillyTavern getLastMessageId API is unavailable');
  }

  if (typeof runtime.getVariables !== 'function') {
    throw new Error('SillyTavern getVariables API is unavailable');
  }

  const getLastMessageId = runtime.getLastMessageId;
  const getVariables = runtime.getVariables;
  const getMvuData = runtime.Mvu?.getMvuData;

  return {
    getLastMessageId: () => getLastMessageId(),
    getVariables: target => getVariables(target),
    ...(getMvuData
      ? {
          getMvuData: target =>
            getMvuData.call(runtime.Mvu, target),
        }
      : {}),
  };
}
