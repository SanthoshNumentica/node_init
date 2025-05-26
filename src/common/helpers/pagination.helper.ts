import { PaginationResult } from "../interfaces/pagination-result.interface";

// src/common/helpers/pagination.helper.ts
export function getPagination<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginationResult<T> {
  const totalPages = Math.ceil(total / limit);
  return {
    data,
    total,
    page,
    limit,
    totalPages,
  };
}
