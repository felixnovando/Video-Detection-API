export enum Status{
    SUCCESS = "SUCCESS",
    FAILED = "FAILED"
}

export interface APIBaseResponse<T>{
    data: T | null;
    status: Status;
    message: string | null;
}