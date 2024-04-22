<script lang="ts">
	import { onMount } from 'svelte';

	export let data: any;
	let saves: any[] = [];

	onMount(() => {
		saves = data.body.saves;
	});
</script>

<h2>Select Save:</h2>

{#each saves as save}
	{#if save != undefined}
		<p>
			<a href={save.uuid}>{save.state.name} ({save.uuid.substring(0, 3)}..)</a>
		</p>
	{/if}
{/each}
