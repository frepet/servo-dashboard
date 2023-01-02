<script lang="ts">
	import Button, { Label } from "@smui/button";
	import type { Action } from "./types";

	export let action: Action;
</script>
{#each action.steps as step}
	(<input type=number value={step.servo}/>: <input type=number value={step.pwm}/>)
{/each}

<Button
	on:click={() => {
		action.steps = [
			...action.steps,
			{
				servo: 0,
				pwm: 0,
			}
		];
	}}
	title="Add Step"
	variant="outlined"
>
	<Label>Add Step</Label>
</Button>

<style>
	input {
		width: 3em;
	}
</style>
