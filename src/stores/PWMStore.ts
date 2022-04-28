import { writable } from 'svelte/store';
export const pwms = writable<number[]>([]);