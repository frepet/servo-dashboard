import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';
import type { IMqttConnection } from '../../types/mqttTypes';

const createMqttConnectionStore = (): {
	subscribe: Writable<IMqttConnection>['subscribe'];
	setClient: (client: any) => void;
	setIsConnected: (isConnected: boolean) => void;
} => {
	const { subscribe, update } = writable<IMqttConnection>({
		isConnected: false,
		client: null
	});

	return {
		subscribe,
		setClient: (client: any) => {
			update((state) => ({ ...state, client }));
		},
		setIsConnected: (isConnected: boolean) => {
			update((state) => ({ ...state, isConnected }));
		}
	};
};

export const mqttConnection = createMqttConnectionStore();
