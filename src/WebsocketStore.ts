import { writable } from "svelte/store";

const messageStore = writable('');

let socket: WebSocket;

const open = (url: string) => {
    socket = new WebSocket(url);
    socket.addEventListener('open', (ev) => messageStore.set("Connected"));
    socket.addEventListener('message', (ev) => messageStore.set(ev.data));
    socket.addEventListener('close', (ev) => messageStore.set("Disconnected"));
    socket.addEventListener('error', (ev) => messageStore.set(`Connection Error: ${ev}`));
}

const close = () => {
    messageStore.set('');
    socket.close();
}

const set = (msg: string) => {
    if (socket.readyState <= 1) {
        socket.send(msg);
    }
}

export default {
    subscribe: messageStore.subscribe,
    open,
    close,
    set,
}