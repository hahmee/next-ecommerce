// src/shared/model/DataResponse.ts

export interface DataResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
}
