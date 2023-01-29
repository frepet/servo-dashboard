<script lang="ts">
	import Step from './Step.svelte';
	import Button, { Label } from "@smui/button";
	import { state } from "./stores/StateStore";
	import type { Step as Step_t, Action as Action_t, Macro as Macro_t} from './types';

	export let id: number;

	function sleep(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	async function runMacro(macro: Macro_t) {
		for (const step of macro.steps) {
			await doStep(step)
		}
	}

	async function doStep(step: Step_t) {
		step.actions.forEach((action: Action_t) => {
			$state.pwms[action.servo] = action.pwm
		})
		await sleep(step.delaySeconds * 1000)
	}

	$: if($state.macros[id].play) {
		$state.macros[id].play = false
		if ($state.macros[id].steps.length > 0) {
			runMacro($state.macros[id])
		}
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

<style>
</style>
