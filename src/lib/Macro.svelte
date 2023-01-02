<script lang="ts">
	import Action from './Action.svelte';
	import Button, { Label } from "@smui/button";
	import { state } from "./stores/StateStore";

	export let id: number;
</script>

{#if $state.macros[id]}
	<ul>
	{#each $state.macros[id].actions as action}
		<li>
			<Action {action}/>
		</li>
	{/each}
	</ul>
{/if}

<Button
	on:click={() => {
		$state.macros[id].actions = [
			...$state.macros[id].actions,
			{
				steps: [],
			}
		];
	}}
	title="Add Action"
	variant="outlined"
>
	<Label>Add Action</Label>
</Button>

<style>
</style>
