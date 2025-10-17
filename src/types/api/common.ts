export interface ApiResponse<T> {
  status: string;
  statusCode: number;
  data: T;
  meta: MetaResponse;
}

export interface MetaResponse {
  timestamp: string;
  path: string;
  method: string;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
