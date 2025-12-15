import { Newable } from 'inversify';

export type ConstructorType = new (...args: unknown[]) => unknown;
export type ClassDependency = {
    [symbolKey: string]: { symbol: symbol; class: Newable<unknown> };
};
export type ValueDependency = {
    [symbolKey: string]: { symbol: symbol; value: unknown };
};
