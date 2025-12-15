export type DependencyInjectionSymbol = { [symbolKey: string]: symbol };

export enum SymbolKeys {
    PasswordCipher = 'PasswordCipher',
}

export const DependencyInjectionSymbols: DependencyInjectionSymbol = {
    [SymbolKeys.PasswordCipher]: Symbol.for('PasswordCipher'),
};
