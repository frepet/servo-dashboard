<script lang="ts">
	import Step from './Step.svelte';
	import Button, { Label } from "@smui/button";
	import { state } from "./stores/StateStore";
	import { buttons } from "./stores/ButtonsStore";
	import type { Step as Step_t, Action as Action_t, Macro as Macro_t} from './types';

	export let id: number;
	let running = false;

	function sleep(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	async function runMacro(macro: Macro_t) {
		for (const step of macro.steps) {
			await doStep(step)
		}
		running = false;
	}

	async function doStep(step: Step_t) {
		step.actions.forEach((action: Action_t) => {
			$state.pwms[action.servo] = action.pwm
		})
		await sleep(step.delaySeconds * 1000)
	}

	$: if (!running && $buttons[$state.macros[id].button]) {
		running = true;
		console.log("Starting Macro")
		if ($state.macros[id].steps.length > 0) {
			runMacro($state.macros[id])
		}
		console.log("Macro Finished")
	} 
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
				delaySeconds: 1,
			}
		];
	}}
	title="Add Step"
	variant="outlined"
>
	<Label>Add Step</Label>
</Button>

<div class="row">
	<p class="label">Button:</p>
	<select bind:value={$state.macros[id].button}>
		<option value={-1}>-</option>
		{#each Array($buttons.length) as _, i}
			<option>{i}</option>
		{/each}
	</select>
</div>

<style>
	.row {
		display: flex;
	}
	.row select {
		margin: auto 0 auto 0;
	}
</style>
