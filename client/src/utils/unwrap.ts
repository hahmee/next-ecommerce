import {FetchJWTResult} from "@/utils/fetchJWT";

//헬퍼함수
export function unwrap<T>(result: FetchJWTResult<T>): T {
    if (!result.success) {
        if (result.code === 403) {
            throw new Error("권한이 없습니다.");
        }
        throw new Error(result.message);
    }
    return result.data;
}