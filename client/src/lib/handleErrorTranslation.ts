import * as m from '$lib/paraglide/messages.js';
import type { APIResponse } from '$lib/types';

export async function handleErrorTranslation(response?: Response | APIResponse | null) {
  if (!response) return m.errors_unknown_error();

  const isJson = response instanceof Response && response.headers.get('content-type')?.includes('application/json');
  const data: APIResponse<false> = isJson ? await response.json() : response;

  if (!data.error) return m.errors_unknown_error();

  if (typeof data.error === 'string') return data.error;

  const errorTranslation = data.error && (m as Record<string, any>)[data.error.code.replace(/./g, '_')];
  return errorTranslation ? errorTranslation(data || {}) : data.error.message || m.errors_unknown_error();
}
