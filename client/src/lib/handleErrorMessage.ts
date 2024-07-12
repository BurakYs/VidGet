import type { APIResponse } from '$lib/types';

export async function handleErrorMessage(response?: Response | APIResponse | null) {
  if (!response) return 'An unknown error occurred';

  const isJson = response instanceof Response && response.headers.get('content-type')?.includes('application/json');
  const data: APIResponse<false> = isJson ? await response.json() : response;

  return data.error || 'An unknown error occurred';
}
