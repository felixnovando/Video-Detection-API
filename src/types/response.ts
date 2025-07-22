export enum Status{
    SUCCESS = "SUCCESS",
    FAILED = "FAILED"
}

export interface APIBaseResponse<T>{
    data: T;
    status: Status;
    message: string | null;
}