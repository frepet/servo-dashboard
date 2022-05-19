import { writable } from 'svelte/store';
export type LocalStore = {
	mode: number;
};
export const localStore = writable<LocalStore>({ mode: 0 });
