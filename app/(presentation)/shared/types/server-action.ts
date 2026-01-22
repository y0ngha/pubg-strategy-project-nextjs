export interface ServerAction<T = undefined> {
    isSuccess: boolean;
    isError: boolean;
    errorMessage?: string;
    data?: T;
    inputs?: { [key: string]: string };
}
