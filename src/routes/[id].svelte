<script lang="ts">
	import type { State } from '$lib/interfaces';
	import { state as stateStore } from '$lib/stores/StateStore';
	import StateCard from '../lib/StateCard.svelte';
	import GamepadsCard from '../lib/GamepadsCard.svelte';
	import ServosCard from '../lib/ServosCard.svelte';
	import WebSocketCard from '../lib/WebSocketCard.svelte';
	import { onMount } from 'svelte';

	export let state: State;

	onMount(() => {
		stateStore.set(state);
	});
</script>

<div class="container">
	<StateCard {state} />
	<GamepadsCard />
	<ServosCard />
	<WebSocketCard />
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
</style>
