<script lang="ts">
	import { stateID } from '$lib/stores/StateIDStore';
	import { state } from '$lib/stores/StateStore';

	let selectedState: string;
	const init = async () => {
		selectedState = await stateID.updateIDs();
	};

	const loadState = async (id?: string) => {
		if (id === '') {
			state.update((s) => {
				return { ...s, name: 'NAME' };
			});
			return;
		}

		if (id !== undefined) {
			await state.fetchState(id);
		}
	};

	$: loadState(selectedState);
	init();
</script>

<div class="container">
	<p>Select Model:</p>
	<select bind:value={selectedState}>
		{#each [...$stateID] as [id, name]}
			<option value={id}>{name}({id})</option>
		{/each}
	</select>
	<button on:click={() => state.uploadState(selectedState)}>Save</button>
</div>

<style>
	.container {
		display: flex;
	}
</style>
