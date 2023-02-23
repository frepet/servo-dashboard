<script lang="ts">
	import WS from '$lib/stores/WebsocketStore';
	import { motors } from '$lib/stores/MotorsStore';
	import { localStore } from './stores/LocalStore';
	import Card, { Content } from '@smui/card';
	import Button from '@smui/button';
	import { onDestroy, onMount } from 'svelte';
	import { state } from './stores/StateStore';
	import type { Servo as Servo_t } from '$lib/types';
	import { browser } from '$app/environment';

	let msgs: string[] = [];
	let port = 22022;
	let connected = false;
	let mouseOver = false;

	$: {
		if ($WS) {
			msgs = [...msgs, $WS];
		}
		connected = WS.isOpen();
	}

	let poll: number;
	const loop = () => {
		if (connected) {
			$WS = JSON.stringify({
				servos: $state.servos.map((servo: Servo_t) => Math.ceil(servo.value)),
				motors: $motors.map((motor: number) => [Math.ceil(Math.abs(motor * 255)), motor > 0]),
				custom: $localStore.mode
			});
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
		if (browser) {
			cancelAnimationFrame(poll);
		}
	});
</script>

<Card>
	<Content>
		<h2>WebSocket</h2>
		Port:<input id="port" class="port" type="number" min={1024} max={65535} bind:value={port} />

		{#if connected}
			<Button on:click={() => WS.close()} variant="raised">Disconnect</Button>
		{:else}
			<Button on:click={() => WS.open(`ws://localhost:${port}`)} variant="outlined">Connect</Button>
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
