type SuccessData = unknown;

type ErrorData =
  | string
  | {
  code: string;
  message: string;
  variables: Record<string, string | number>;
};

export type APIResponse<Success = true> = {
  success: Success;
  status: number;
  data: Success extends true ? SuccessData : null;
  error: Success extends false ? ErrorData : null;
};
