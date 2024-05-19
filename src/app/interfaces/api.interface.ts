export interface TotsApiResponse<T> {
  success: boolean,
  response: T
}

export interface TotsApiPagination {
  current_page: number;
  first_page_url: string;
  from: string;
  last_page: number;
  last_page_url: string;
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: string;
  to: string;
  total: number;
}
