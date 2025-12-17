export type AbstractNewable<
    TInstance = unknown,
    TArgs extends unknown[] = unknown[],
> = abstract new (...args: TArgs) => TInstance;

export type Newable<
    TInstance = unknown,
    TArgs extends unknown[] = unknown[],
> = new (...args: TArgs) => TInstance;

export type ClassDependency = {
    class: Newable<unknown>;
    abstract?: AbstractNewable<unknown>;
};

export type ValueDependency = {
    [symbolKey: string]: { symbol: symbol; value: unknown };
};
