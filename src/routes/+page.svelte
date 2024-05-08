<script lang="ts">
	import Card, { Content } from '@smui/card';
	import List, { Item, Text } from '@smui/list';
	import { onMount } from 'svelte';

	export let data: any;
	let saves: any[] = [];

	onMount(() => {
		saves = data.body.saves;
	});
</script>

<Card>
	<Content>
		Select Save:
	</Content>
	<Content component={List}>
	{#each saves as save}
		{#if save != undefined}
			<Item>
				<a href={save.uuid}>{save.state.name} ({save.uuid.substring(0, 3)}..)</a>
			</Item>
		{/if}
	{/each}
	</Content>
</Card>