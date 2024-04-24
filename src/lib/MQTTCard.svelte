<script lang="ts">
	import { Buffer } from 'buffer';
	import { onDestroy, onMount } from 'svelte';
	import mqtt from 'mqtt';
	import { mqttConnection } from './stores/MQTTStore';
	import type { IClientOptions, MqttClient, IClientPublishOptions } from 'mqtt';
	import Card, { Content } from '@smui/card';
	import Button from '@smui/button';
	import { state } from './stores/StateStore';

	let mouseOver = false;
	let client: MqttClient | null = null;
	let msgs: Array<string> = [];
	const QoS0_RETAIN: IClientPublishOptions = {
		qos: 0,
		retain: true
	};
	const LAST_WILL_MSG: Buffer = Buffer.from('OFFLINE');

	function connectToBroker(): void {
		msgs = ['Connecting to the broker..', ...msgs];
		const options: IClientOptions = {
			connectTimeout: 4000,
			clientId: 'svelte_mqtt_' + Math.random().toString(16),
			will: {
				topic: `${$state.mqttSettings.topic_prefix}/statuses/dashboard`,
				payload: LAST_WILL_MSG,
				qos: 1,
				retain: true
			}
		};

		client = mqtt.connect(`mqtt://localhost:${$state.mqttSettings.port}`, options);
		mqttConnection.setClient(client);

		client.on('connect', () => {
			msgs = ['CONNECTED!', ...msgs];
			mqttConnection.setIsConnected(true);
		});

		client.on('error', () => {
			mqttConnection.setIsConnected(false);
		});

		client.on('disconnect', () => {
			msgs = ['DISCONNECTED!', ...msgs];
			mqttConnection.setIsConnected(false);
		});
	}

	function disconnectFromBroker(): void {
		msgs = ['Disconnected from the broker!', ...msgs];
		client?.publish(`${$state.mqttSettings.topic_prefix}/statuses/dashboard`, 'OFFLINE', {
			qos: 1,
			retain: true
		});
		mqttConnection.setIsConnected(false);
		client?.end();
	}

	let lastTime = 0;
	const interval = 100;
	let poll: number;
	const loop = (currentTime: number) => {
		if (currentTime - lastTime > interval) {
			lastTime = currentTime;

			if (client?.connected) {
				$state.servos.forEach((servo, index) =>
					client?.publish(
						`${$state.mqttSettings.topic_prefix}/servos/${index}`,
						Math.ceil(servo.value).toString(),
						{ qos: 0, retain: true }
					)
				);
				$state.motors.forEach((motor, index) =>
					client?.publish(
						`${$state.mqttSettings.topic_prefix}/motors/${index}`,
						Math.round(motor.value).toString(),
						{ qos: 0, retain: true }
					)
				);
				client?.publish(`${$state.mqttSettings.topic_prefix}/statuses/dashboard`, 'OK', { qos: 0, retain: true });
			}

			if (!mouseOver) {
				const msgbox = document.getElementById('msgbox');
				if (msgbox) {
					msgbox.scrollTo(0, msgbox.scrollHeight);
				}
			}
		}

		poll = requestAnimationFrame(loop);
	};

	onMount(() => {
		poll = requestAnimationFrame(loop);
	});

	onDestroy(() => {
		client?.end();
		console.log('Disconnected from the broker!');
		mqttConnection.setIsConnected(false);
	});
</script>

<Card>
	<Content>
		<h2>MQTT</h2>
		Topic Prefix:<input
			id="topic_prefix"
			class="port"
			type="text"
			bind:value={$state.mqttSettings.topic_prefix}
		/>
		Port:
		<input
			id="port"
			class="port"
			type="number"
			min={1024}
			max={65535}
			bind:value={$state.mqttSettings.port}
		/>

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
