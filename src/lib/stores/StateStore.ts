import { writable, get } from 'svelte/store';
import { pwms } from './PWMStore';
import type { State } from '$lib/interfaces';

const BACKEND = 'http://localhost';
const store = writable<State>({
	uuid: '',
	name: '',
	pwms: [],
	servos: []
});

const uploadState = async (id: string) => {
	try {
		const body = {
			...get(store),
			pwms: get(pwms)
		};

		let url = `${BACKEND}/state`;
		if (id !== '') {
			url = `${url}/${id}`;
		}

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
