import { APIBaseResponse, Status } from "../types";

export class ResponseHelper {
    public static success<T> (data: T): APIBaseResponse<T> {
        return {
            data,
            message: null,
            status: Status.SUCCESS
        }
    }

    public static fail(error: string): APIBaseResponse<never> {
        return {
            data: null,
            message: error,
            status: Status.FAILED
        }
    }
}
