<script lang="ts">
	import Button, { Label } from "@smui/button";
	import type { Step } from "./types";

	export let step: Step
</script>
{#each step.actions as action}
	(<input type=number bind:value={action.servo}/>: <input type=number bind:value={action.pwm}/>)
{/each}

<Button
	on:click={() => {
		step.actions = [
			...step.actions,
			{
				servo: 0,
				pwm: 0,
			}
		];
	}}
	title="Add Action"
	variant="outlined"
>
	<Label>Add Action</Label>
</Button>

<style>
	input {
		width: 3em;
	}
</style>
