export type DependencyInjectionSymbol = { [symbolKey: string]: symbol };

/**
 * Only used for value injection
 */

export enum SymbolKeys {}

export const DependencyInjectionSymbols: DependencyInjectionSymbol = {};
