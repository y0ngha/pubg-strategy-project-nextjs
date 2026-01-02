/**
 * DI를 위해 Any 타입을 일시적으로 허용합니다.
 * unknown 타입의 경우 di-server-factory.ts에서 값을 넣을 때 오류가 납니다.
 * -> 타입 좁히기를 통해 타입을 좁혀야하는데, di 등록시 타입 좁히기를 계속 쓰는 것이 번거롭습니다.
 * never 타입의 경우 논리적으로 맞지 않습니다.
 * -> 가장 하위 타입이어서 타입 체크에는 문제가 없으나, 인자를 절대 받을 일 없다라고 선언하는거와 똑같기에 논리적으로 맞지 않음.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

export type AbstractNewable<
    TInstance = any,
    TArgs extends any[] = any[],
> = abstract new (...args: TArgs) => TInstance;

export type Newable<TInstance = any, TArgs extends any[] = any[]> = new (
    ...args: TArgs
) => TInstance;

export type ClassDependency = {
    class: Newable<any>;
    abstract?: AbstractNewable<any>;
};

export type ValueDependency = {
    [symbolKey: string]: { symbol: symbol; value: any };
};
