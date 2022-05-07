<script lang="ts">
	import WS from '$lib/stores/WebsocketStore';
	import { pwms } from '$lib/stores/PWMStore';
	import Card, { Content } from '@smui/card';
	import { onDestroy, onMount } from 'svelte';

	let msgs: string[] = [];
	let port: number = 22022;
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
			$WS = JSON.stringify({ servos: $pwms.map((pwm: number) => Math.ceil(pwm)) });
		}

		if (!mouseOver) {
			const msgbox = document.getElementById('msgbox');
			if (msgbox) {
				msgbox.scrollTo(0, msgbox.clientHeight);
			}
		}

		poll = requestAnimationFrame(loop);
	};

	let stopLoop = (id: number) => {};
	onMount(() => {
		stopLoop = (id: number) => cancelAnimationFrame(id);
		loop();
	});

	onDestroy(() => {
		stopLoop(poll);
	});
</script>

<Card>
	<Content>
		<h2>WebSocket</h2>
		Port:<input id="port" class="port" type="number" min={1024} max={65535} bind:value={port} />

		{#if connected}
			<button on:click={() => WS.close()}>Disconnect</button>
		{:else}
			<button on:click={() => WS.open(`ws://localhost:${port}`)}>Connect</button>
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
