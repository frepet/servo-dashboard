import { writable, get } from 'svelte/store';
import { pwms } from './PWMStore';
import type { State } from '../interfaces';


const BACKEND = 'https://servo-dashboard-backend.herokuapp.com';
let store = writable<State>({
    'name': 'NAME',
    'pwms': [],
    'servos': []
});

const loadStateFromResponse = (data: State) => {
        if (data['pwms']) {
            pwms.set(data['pwms']);
        }
};

const fetchState = async (id: string) => {
    try {
        const response = await fetch(`${BACKEND}/state/${id}`, {
            headers: {
                'Accept': 'application/json'
            }
        });
        const data: State = await response.json();
        store.set(data);

        loadStateFromResponse(data);
    } catch(error) {
        console.log(error);
    }
};

const uploadState = async (id: string) => {
    try {
        const body = {
            ...get(store),
            pwms: get(pwms)
        };

        let url = `${BACKEND}/state`;
        if (id !== "") {
            url = `${url}/${id}`;
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

    } catch(error) {
        console.log(error);
    }
};

export const state = {
    subscribe: store.subscribe,
    set: store.set,
    update: store.update,
    fetchState,
    uploadState: uploadState,
};