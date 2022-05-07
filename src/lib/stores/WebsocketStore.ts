import { writable } from 'svelte/store';

const messageStore = writable('');
let socket: WebSocket;

const open = (url: string) => {
	socket = new WebSocket(url);
	socket.addEventListener('open', (ev) => messageStore.set('[INFO] WebSocket Connected'));
	socket.addEventListener('message', (ev) =>
		messageStore.set(`${new Date().toLocaleTimeString('en-US', { hour12: false })}: ${ev.data}`)
	);
	socket.addEventListener('close', (ev) =>
		messageStore.set('[WARN] WebSocket disconnected from server!')
	);
};

const close = () => {
	socket.close();
};

const set = (msg: string) => {
	if (socket.readyState <= 1) {
		socket.send(msg);
	}
};

const isOpen = () => {
	if (socket == undefined) {
		return false;
	}
	return socket.readyState <= 1;
};

export default {
	subscribe: messageStore.subscribe,
	open,
	close,
	set,
	isOpen
};
