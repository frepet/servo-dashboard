<script lang="ts">
	import { Buffer } from 'buffer';
	import { onDestroy, onMount } from 'svelte';
	import mqtt from 'mqtt';
	import { mqttConnection } from './stores/MQTTStore';
	import type { IClientOptions, MqttClient, IClientPublishOptions } from 'mqtt';
	import Card, { Content } from '@smui/card';
	import Button from '@smui/button';
	import { state } from './stores/StateStore';
	import { beforeNavigate } from '$app/navigation';

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
				topic: `${$state.mqttSettings.topicPrefix}/statuses/dashboard`,
				payload: LAST_WILL_MSG,
				qos: 2,
				retain: true
			}
		};

		client = mqtt.connect(`mqtt://localhost:${$state.mqttSettings.port}`, options);
		mqttConnection.setClient(client);

		client.on('connect', () => {
			msgs = ['CONNECTED!', ...msgs];
			mqttConnection.setIsConnected(true);
			client?.subscribe(`${$state.mqttSettings.topicPrefix}/pong`, (err) => {
				if (!err) {
					console.log('Subscription successful');
				} else {
					console.error('Subscription failed:', err);
				}
			});
		});

		client.on('error', () => {
			mqttConnection.setIsConnected(false);
		});

		client.on('message', (topic, message) => {
			if (topic === `${$state.mqttSettings.topicPrefix}/pong`) {
				ping = Date.now() - Number(message);
			}
		});

		client.on('disconnect', () => {
			msgs = ['DISCONNECTED!', ...msgs];
			mqttConnection.setIsConnected(false);
		});
	}

	function disconnectFromBroker(): void {
		msgs = ['Disconnected from the broker!', ...msgs];
		client?.publish(`${$state.mqttSettings.topicPrefix}/statuses/dashboard`, 'OFFLINE', {
			qos: 2,
			retain: true
		});
		mqttConnection.setIsConnected(false);
		client?.end();
	}

	let lastTimeOfStatus: number = 0;
	let lastTimeOfServo: Array<number> = Array(100).fill(100);
	let lastTimeOfMotor: Array<number> = Array(100).fill(100);
	let sentServoValues: Array<number> = [];
	let sentMotorValues: Array<number> = [];
	$: delayBetweenSends = Math.max(1, (1000 / $state.mqttSettings.updateFrequency));
	let poll: number;
	const loop = () => {
		if (client?.connected) {
			$state.servos.forEach((servo, index) => {
				if (sentServoValues[index] != servo.value) {
					if (Date.now() > lastTimeOfServo[index] + delayBetweenSends) {
						client?.publish(
							`${$state.mqttSettings.topicPrefix}/servos/${index}`,
							Math.ceil(servo.value).toString(),
							{ qos: 2, retain: true }
						);
						sentServoValues[index] = servo.value;
						lastTimeOfServo[index] = Date.now();
					}
				}
			});

			$state.motors.forEach((motor, index) => {
				if (sentMotorValues[index] != motor.value) {
					if (Date.now() > lastTimeOfMotor[index] + delayBetweenSends) {
					client?.publish(
						`${$state.mqttSettings.topicPrefix}/motors/${index}`,
						Math.round(motor.value).toString(),
						{ qos: 2, retain: true }
					);
					sentMotorValues[index] = motor.value;
					lastTimeOfMotor[index] = Date.now();
					}
				}
			});

			if (Date.now() > lastTimeOfStatus + delayBetweenSends*10) {
				client?.publish(`${$state.mqttSettings.topicPrefix}/statuses/dashboard`, 'OK', { qos: 2, retain: false});
				lastTimeOfStatus = Date.now();
			}
		}

		if (!mouseOver) {
			const msgbox = document.getElementById('msgbox');
			if (msgbox) {
				msgbox.scrollTo(0, msgbox.scrollHeight);
			}
		}
		poll = requestAnimationFrame(loop);
	};

	let pingLoopId: NodeJS.Timer;
	let ping = 0;
	const sendPing = () => {
		if (client?.connected) {
			client?.publish(`${$state.mqttSettings.topicPrefix}/ping`, Date.now().toFixed(0), { qos: 0, retain: false});
		}
	};

	const handlePong = () => {

	}

	onMount(() => {
		poll = requestAnimationFrame(loop);
		pingLoopId = setInterval(sendPing, 1000);
	});

	onDestroy(() => {
		client?.publish(`${$state.mqttSettings.topicPrefix}/statuses/dashboard`, 'OFFLINE', { qos: 2, retain: true});
		client?.end();
		mqttConnection.setIsConnected(false);
		clearInterval(pingLoopId);
	});

	beforeNavigate(() => {
		client?.publish(`${$state.mqttSettings.topicPrefix}/statuses/dashboard`, 'OFFLINE', { qos: 2, retain: true});
		client?.end();
		mqttConnection.setIsConnected(false);
		clearInterval(pingLoopId);
	});
</script>

<Card>
	<Content>
		<h2>MQTT</h2>
		<h4>Connection settings:</h4>
		Topic Prefix:<input
			id="topicPrefix"
			class="port"
			type="text"
			disabled={$mqttConnection.isConnected}
			bind:value={$state.mqttSettings.topicPrefix}
		/>
		Port:
		<input
			id="port"
			class="port"
			type="number"
			min={1024}
			max={65535}
			disabled={$mqttConnection.isConnected}
			bind:value={$state.mqttSettings.port}
		/>
		Update Frequency:
		<input 
			type="number"
			class="port"
			min={1}
			max={100}
			bind:value={$state.mqttSettings.updateFrequency}
		/>
		{#if $mqttConnection.isConnected}
			<Button on:click={() => disconnectFromBroker()} variant="raised">Disconnect</Button>
			<ul>
				<li>Ping: {ping} ms</li>
			</ul>
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
