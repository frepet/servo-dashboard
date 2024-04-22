<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import mqtt from 'mqtt';
	import { mqttConnection } from './stores/MQTTStore';
	import type { IClientOptions, MqttClient } from 'mqtt';
	import Card, { Content } from '@smui/card';
	import Button from '@smui/button';

	let mouseOver = false;
	let port = 9001;
	let client: MqttClient | null = null;
	let msgs: Array<string> = [];

	function connectToBroker(): void {
		console.log('connectToBroker');
		const options: IClientOptions = {
			connectTimeout: 4000,
			clientId: 'svelte_mqtt_' + Math.random().toString(16)
		};

		client = mqtt.connect(`mqtt://localhost:${port}`, options);
		mqttConnection.setClient(client);

		client.on('connect', () => {
			console.log('Connected to the broker!');
			mqttConnection.setIsConnected(true);
		});

		client.on('error', (error) => {
			console.error('Connection failed:', error);
			mqttConnection.setIsConnected(false);
		});

		client.on('disconnect', () => {
			console.error('Disconnected:');
			mqttConnection.setIsConnected(false);
		});
	}

	function disconnectFromBroker(): void {
		console.log('Disconnected from the broker!');
		mqttConnection.setIsConnected(false);
		client?.end();
	}

	let poll: number;
	const loop = () => {
		if ($mqttConnection.isConnected) {
		}

		if (!mouseOver) {
			const msgbox = document.getElementById('msgbox');
			if (msgbox) {
				msgbox.scrollTo(0, msgbox.scrollHeight);
			}
		}

		poll = requestAnimationFrame(loop);
	};

	onMount(() => {
		loop();
	});

	onDestroy(() => {
		client?.end();
	});
</script>

<Card>
	<Content>
		<h2>MQTT</h2>
		Port:<input id="port" class="port" type="number" min={1024} max={65535} bind:value={port} />

		{#if $mqttConnection.isConnected}
			<Button on:click={() => disconnectFromBroker()} variant="raised">Disconnect</Button>
		{:else}
			<Button on:click={() => connectToBroker()} variant="outlined">Connect</Button>
		{/if}

		<hr />
		<div
			class="messages"
			id="msgbox"
			on:mouseenter={() => (mouseOver = true)}
			on:mouseleave={() => (mouseOver = false)}
		>
			{#each msgs as msg}
				<p>{msg}</p>
			{/each}
		</div>
	</Content>
</Card>

<style>
	h2 {
		margin-top: 0em;
	}

	.port {
		margin-top: 0px;
		background-color: beige;
		border-radius: 0.5em;
		width: 5em;
	}

	.messages {
		overflow-y: auto;
		max-height: 20em;
	}

	.messages p {
		margin: 0em;
	}
</style>
