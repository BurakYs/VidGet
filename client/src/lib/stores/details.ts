import { type Writable, writable } from 'svelte/store';
import type { ScraperResult } from '$lib/types';

const detailsStore: Writable<ScraperResult> = writable();

export default detailsStore;