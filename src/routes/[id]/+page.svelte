<script lang="ts">
	import type { State } from '$lib/types';
	import { state as stateStore } from '$lib/stores/StateStore';
	import StateCard from '$lib/StateCard.svelte';
	import GamepadsCard from '$lib/GamepadsCard.svelte';
	import ServosCard from '$lib/ServosCard.svelte';
	import MotorsCard from '$lib/SkidSteersCard.svelte';
	import MacrosCard from '$lib/MacrosCard.svelte';
	import WebSocketCard from '$lib/WebSocketCard.svelte';
	import { onMount } from 'svelte';

	export let data: any;
	let state: State;
	let uuid: string;

	onMount(() => {
		state = data.body.state;
		uuid = data.body.uuid;
		stateStore.set(state);
	});
</script>

<div class="container">
	{#if state != undefined}
		<StateCard {uuid} />
		<GamepadsCard />
		<ServosCard />
		<MotorsCard />
		<MacrosCard />
		<WebSocketCard />
	{/if}
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
</style>
