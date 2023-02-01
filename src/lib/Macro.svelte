<script lang="ts">
	import Step from './Step.svelte';
	import Button, { Label } from "@smui/button";
	import { state } from "./stores/StateStore";
	import { buttons } from "./stores/ButtonsStore";
	import { clamp } from '$lib/utils';
	import type { Step as Step_t, Action as Action_t, Macro as Macro_t} from './types';

	export let id: number
	let running = false
	let smoothingSteps = 20
	let smoothingIntesity = 0.5

	function sleep(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	function logistic(i: number, iMax: number, start: number, goal: number) {
		let k = smoothingIntesity
		let end = goal - start
		let midpoint = iMax / 2
		return start + end / (1  + Math.pow(Math.E, -k * (i - midpoint)))
	}

	async function runMacro(macro: Macro_t) {
		setTimeout(() => {
			running = false
		}, 2000)

		for (const step of macro.steps) {
			doStep(step)
			await sleep(step.delaySeconds * 1000)
		}
	}

	function doStep(step: Step_t) {
		step.actions.forEach((action: Action_t) => {
			let start = $state.pwms[action.servo]
			let goal = clamp(action.pwm, $state.servos[action.servo].min, $state.servos[action.servo].max)
			let smoothingDelay = (step.delaySeconds * 1000 / smoothingSteps)
			for (let i = 0;  i < smoothingSteps; i++) {
				if (i < smoothingSteps - 1) {
					setTimeout(() => {
						$state.pwms[action.servo] = logistic(i, smoothingSteps - 0.5, start, goal)
					},
					smoothingDelay * i
					)
				} else {
					setTimeout(() => {
						$state.pwms[action.servo] = goal
					},
					smoothingDelay * i
					)
				}
			}
		})
	}

	$: if (!running && $buttons[$state.macros[id].button]) {
		running = true;
		if ($state.macros[id].steps.length > 0) {
			runMacro($state.macros[id])
		}
	} 
</script>

<div class="row">
	<p class="label">Button:</p>
	<select bind:value={$state.macros[id].button}>
		<option value={-1}>-</option>
		{#each Array($buttons.length) as _, i}
			<option>{i}</option>
		{/each}
	</select>
</div>

{#if $state.macros[id]}
	<ul>
	{#each $state.macros[id].steps as step}
		<hr/>
		<li>
			<Step {step}/>
		</li>
	{/each}
	<hr/>
	</ul>
{/if}

<ul>
	<li>
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
	</li>
</ul>

<style>
	.row {
		display: flex;
	}
	.row select {
		margin: auto 0 auto 0;
	}
</style>
