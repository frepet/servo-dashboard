<script lang="ts">
	import { state as stateStore } from '$lib/stores/StateStore';
	import type { State } from './interfaces';
	export let state: State;
</script>

<div class="container">
	{state.uuid}
	<button on:click={() => stateStore.uploadState(state.uuid)}>Save</button>
</div>

<style>
	.container {
		display: flex;
	}
</style>
