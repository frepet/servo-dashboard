<script lang="ts">
	import { onMount } from 'svelte';

	export let data: any;
	let saves: any[] = [];

	onMount(() => {
		saves = data.body.saves;
	});
</script>

<h2>Select Save:</h2>

<ul>
	{#each saves as save}
		{#if save != undefined}
			<li>
				<a href={save.uuid}>{save.state.name} ({save.uuid.substring(0, 3)}..)</a>
			</li>
		{/if}
	{/each}
</ul>

<style lang="css">
	h2 {
		color: #db1c26;
	}
	a {
		text-decoration: none;
		color: white;
	}
	ul {
		color: #db1c26;
	}
</style>
