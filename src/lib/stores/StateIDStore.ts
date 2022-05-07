import { writable } from 'svelte/store';

const BACKEND = 'https://servo-dashboard-backend.herokuapp.com';
let stateIDs = writable<Map<string, string>>(new Map());

const updateIDs = async () => {
    let first: string = "";
    try {
        const response = await fetch(BACKEND +  '/state', {
            headers: {
                'Accept': 'application/json'
            }
        });
        const json = await response.json()
        stateIDs.set(new Map(Object.entries(json)));
        
        try {
            first = Object.entries(json)[0][0];
        } catch {
            first = "";
        }
    } catch(error) {
        console.log(error);
    }
    return first;
};

export const stateID = {
    subscribe: stateIDs.subscribe,
    updateIDs
};