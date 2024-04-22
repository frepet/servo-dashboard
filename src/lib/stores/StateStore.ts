import { get, writable } from 'svelte/store';
import type { State } from '$lib/types';
import { IK } from '$lib/IK/IK';

const store = writable<State>({
	version: 1,
	name: '',
	settings: { IKEnabled: false, IFrameEnabled: false },
	deadzones: [],
	servos: [],
	motors: [],
	skidsteers: [],
	mecanumsteers: [],
	macros: [],
	swapButton: -1,
	ik: new IK(),
	iframeSettings: { src: '', height: 100 }
});

const uploadState = async (id: string) => {
	try {
		const url = `${window.location.origin}/api/${id}`;

		console.log(JSON.stringify({ ...get(store) }));

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify({ ...get(store) })
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
