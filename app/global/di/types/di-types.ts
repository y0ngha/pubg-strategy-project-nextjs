import { Newable } from "inversify";

export type ConstructorType = new (...args: any[]) => any;
export type ClassDependency = { [symbolKey: string]: { symbol: symbol, class: Newable<any> } }
export type ValueDependency = { [symbolKey: string]: { symbol: symbol, value: any } } 