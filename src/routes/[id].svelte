<div class='container'>
	<StateCard/>
	<GamepadsCard/>
	<ServosCard/>
	<WebSocketCard/>
</div>

<script lang="ts">
	//import type { State } from './[id]';
	import StateCard from '../lib/StateCard.svelte';
	import GamepadsCard from '../lib/GamepadsCard.svelte';
	import ServosCard from '../lib/ServosCard.svelte';
	import WebSocketCard from '../lib/WebSocketCard.svelte';

	//export let state: State;
</script>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
</style>