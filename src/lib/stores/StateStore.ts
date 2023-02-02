import { get, writable } from 'svelte/store';
import type { State } from '$lib/types';

const store = writable<State>({
	version: 1,
	name: '',
	deadzones: [],
	servos: [],
	skidsteers: [],
	macros: [],
	swapButton: -1
});

const uploadState = async (id: string) => {
	try {
		const url = `${window.location.origin}/state/${id}`;

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify({...get(store)})
		});

		return response;
	} catch (error) {
		console.log(error);
	}
};

export const state = {
	subscribe: store.subscribe,
	set: store.set,
	update: store.update,
	uploadState: uploadState
};
