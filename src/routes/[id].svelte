<script lang="ts">
	import type { State } from '$lib/types';
	import { state as stateStore } from '$lib/stores/StateStore';
	import { pwms } from '$lib/stores/PWMStore';
	import StateCard from '../lib/StateCard.svelte';
	import GamepadsCard from '../lib/GamepadsCard.svelte';
	import ServosCard from '../lib/ServosCard.svelte';
	import MotorsCard from '../lib/SkidSteersCard.svelte';
	import MacrosCard from '../lib/MacrosCard.svelte';
	import WebSocketCard from '../lib/WebSocketCard.svelte';
	import { onMount } from 'svelte';

	export let state: State;
	export let uuid: string;

	onMount(() => {
		$pwms = state.pwms;
		stateStore.set(state);
	});
</script>

<div class="container">
	<StateCard {uuid} />
	<GamepadsCard />
	<ServosCard />
	<MotorsCard />
	<MacrosCard />
	<WebSocketCard />
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
</style>
