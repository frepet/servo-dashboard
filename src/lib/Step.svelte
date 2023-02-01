<script lang="ts">
	import Button, { Label } from "@smui/button";
	import { state } from "./stores/StateStore";
	import type { Step } from "./types";

	export let step: Step
</script>
{#each step.actions as action, i}
	<p>
		Servo: <input type=number bind:value={action.servo}/> PWM:<input type=number bind:value={action.pwm}/>
		<Button
			on:click={() => { step.actions = step.actions.filter((_, j) => j != i) }}
			title="Remove"
			variant="outlined" >
			<Label>Remove</Label>
		</Button>
	</p>
{/each}

<p>
	Action time(s):<input class="valueInput" type="number" step={0.1} bind:value={step.delaySeconds}/>
</p>

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
