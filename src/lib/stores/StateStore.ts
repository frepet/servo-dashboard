import { writable, get } from 'svelte/store';
import { pwms } from './PWMStore';
import type { State } from '$lib/types';

const store = writable<State>({
	version: 1,
	name: '',
	pwms: [],
	deadzones: [],
	servos: [],
	skidsteers: [],
	swapButton: -1,
});

const uploadState = async (id: string) => {
	try {
		const body = {
			...get(store),
			pwms: get(pwms),
		};

		const url = `${window.location.origin}/state/${id}`;

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify(body)
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
