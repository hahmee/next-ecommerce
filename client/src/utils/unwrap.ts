import {FetchJWTResult} from "@/utils/fetchJWT";

//헬퍼함수
export function unwrap<T>(result: FetchJWTResult<T>): T {
    if (!result.success) {
        throw new Error(result.message);
    }
    return result.data;
}