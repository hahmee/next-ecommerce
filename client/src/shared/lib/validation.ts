// src/shared/lib/validation.ts

export const isBlank = (v?: string | null) => !v || v.trim() === '';
