import { writable } from 'svelte/store';
export const motors = writable<number[]>([]);
