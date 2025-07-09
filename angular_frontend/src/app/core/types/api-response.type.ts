export type ApiResponse<T> = {
  data: T;
};

export type ApiErrorResponse = {
  error: {
    internalCode?: number;
    message?: string;
  };
};