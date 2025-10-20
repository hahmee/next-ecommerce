// src/shared/model/Option.ts

export interface Option<T> {
  id: T;
  content: string;
  startDate?: string;
  endDate?: string;
}
