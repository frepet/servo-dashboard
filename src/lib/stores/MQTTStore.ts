import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';
import type { IMqttConnection, IMqttSettings } from '../../types/mqttTypes';

const createMqttConnectionStore = (): {
	subscribe: Writable<IMqttConnection>['subscribe'];
	setConnection: (settings: IMqttSettings) => void;
	setClient: (client: any) => void;
	setIsConnected: (isConnected: boolean) => void;
} => {
	const { subscribe, update } = writable<IMqttConnection>({
		url: 'wss://broker.emqx.io',
		port: 8083,
		username: '',
		password: '',
		isConnected: false,
		client: null
	});

	return {
		subscribe,
		setConnection: ({ url, port, username, password }) => {
			update((state) => ({ ...state, url, port, username, password }));
		},
		setClient: (client: any) => {
			update((state) => ({ ...state, client }));
		},
		setIsConnected: (isConnected: boolean) => {
			update((state) => ({ ...state, isConnected }));
		}
	};
};

export const mqttConnection = createMqttConnectionStore();
