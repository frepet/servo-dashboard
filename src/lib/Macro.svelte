<script lang="ts">
	import Step from './Step.svelte';
	import Button, { Label } from "@smui/button";
	import { state } from "./stores/StateStore";

	export let id: number;
</script>

{#if $state.macros[id]}
	<ul>
	{#each $state.macros[id].steps as step}
		<li>
			<Step {step}/>
		</li>
	{/each}
	</ul>
{/if}

<Button
	on:click={() => {
		$state.macros[id].steps = [
			...$state.macros[id].steps,
			{
				actions: [],
			}
		];
	}}
	title="Add Step"
	variant="outlined"
>
	<Label>Add Step</Label>
</Button>

<style>
</style>
