export function curry<T1, T2, T3, R>(f: (a: T1, b?: T2, c?: T3) => R, arg: T1): (b?: T2, c?: T3) => R;
export function curry<T1, T2, T3, R>(f: (a: T1, b: T2, c?: T3) => R, arg: T1): (b: T2, c?: T3) => R;
export function curry<T1, T2, T3, R>(f: (a: T1, b: T2, c: T3) => R, arg: T1): (b: T2, c: T3) => R;
export function curry<T1, T2, R>(f: (a: T1, b?: T2) => R, arg: T1): (b?: T2) => R;
export function curry<T1, T2, R>(f: (a: T1, b: T2) => R, arg: T1): (b: T2) => R;
export function curry<T1, R>(f: (a?: T1) => R, arg?: T1): () => R;
export function curry<T1, R>(f: (a: T1) => R, arg: T1): () => R;
export function curry<T1, R>(f: (a: T1, ...whatever: any[]) => R, arg: T1): (...whatever: any[]) => R {
    return (...args: any[]) => f(arg, ...args);
}