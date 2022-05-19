<script lang="ts">
	import { axes } from '$lib/stores/AxesStore';
	import { motors } from '$lib/stores/MotorsStore';
	import { state } from '$lib/stores/StateStore';
	import { localStore } from './stores/LocalStore';
	import { clamp } from '$lib/utils';
	import { onDestroy } from 'svelte';

	export let id = 0;

	const leftMotor = id * 2;
	const rightMotor = id * 2 + 1;

	$motors[leftMotor] = 0;
	$motors[rightMotor] = 0;

	const skidSteer: (throttle: number, steering: number) => [number, number] = (
		throttle,
		steering
	) => {
		return [clamp(throttle + steering, -1, 1), clamp(throttle - steering, -1, 1)];
	};

	let poll: number;
	const loop = () => {
		if ($state.skidsteers) {
			const motorState = $state.skidsteers[id];
			let forwardAxis = $localStore.mode === 0 ? motorState.forwardAxis : motorState.forwardAxis2;
			let reverseAxis = $localStore.mode === 0 ? motorState.reverseAxis : motorState.reverseAxis2;
			let turnAxis = $localStore.mode === 0 ? motorState.turnAxis : motorState.turnAxis2;
			let reversed = $localStore.mode === 0 ? motorState.reversed : motorState.reversed2;

			let steering = 0;
			if ($axes[turnAxis] != undefined) {
				steering = motorState.turnSpeed * $axes[turnAxis];
			}

			let throttle = 0;
			if ($axes[forwardAxis] != undefined && $axes[reverseAxis] != undefined) {
				if (forwardAxis === reverseAxis) {
					throttle = $axes[forwardAxis];
				} else {
					throttle = (motorState.speed * ($axes[forwardAxis] - $axes[reverseAxis])) / 2;
				}
				throttle *= reversed ? -1 : 1;
			}

			const [left, right] = skidSteer(throttle, steering);
			$motors[leftMotor] = left;
			$motors[rightMotor] = right;
		}
		poll = requestAnimationFrame(loop);
	};
	loop();

	onDestroy(() => cancelAnimationFrame(poll));
</script>

<div class="servocontents">
	{#if $state.skidsteers[id]}
		<ul>
			<li class="row">
				<p class="label">Left</p>
				<p class="value">{$motors[leftMotor].toFixed(2)}</p>
				<input
					class="slider"
					type="range"
					min={-1}
					max={1}
					step={0.01}
					bind:value={$motors[leftMotor]}
				/>
			</li>

			<li class="row">
				<p class="label">Right</p>
				<p class="value">{$motors[rightMotor].toFixed(2)}</p>
				<input
					class="slider"
					type="range"
					min={-1}
					max={1}
					step={0.01}
					bind:value={$motors[rightMotor]}
				/>
			</li>

			<li class="row">
				<p class="label">Speed</p>
				<p class="value">{$state.skidsteers[id].speed}</p>
				<input
					class="slider"
					type="range"
					min={0}
					max={1}
					step={0.01}
					bind:value={$state.skidsteers[id].speed}
				/>
			</li>

			<li class="row">
				<p class="label">Turn Speed</p>
				<p class="value">{$state.skidsteers[id].turnSpeed}</p>
				<input
					class="slider"
					type="range"
					min={0}
					max={1}
					step={0.01}
					bind:value={$state.skidsteers[id].turnSpeed}
				/>
			</li>
		</ul>

		<ul>
			<li class="row">
				<p class="label">Forward Axis:</p>
				<select bind:value={$state.skidsteers[id].forwardAxis}>
					<option value={-1}>-</option>
					{#each Array($axes.length) as _, i}
						<option>{i}</option>
					{/each}
				</select>
				<select bind:value={$state.skidsteers[id].forwardAxis2}>
					<option value={-1}>-</option>
					{#each Array($axes.length) as _, i}
						<option>{i}</option>
					{/each}
				</select>
			</li>

			<li class="row">
				<p class="label">Reverse Axis:</p>
				<select bind:value={$state.skidsteers[id].reverseAxis}>
					<option value={-1}>-</option>
					{#each Array($axes.length) as _, i}
						<option>{i}</option>
					{/each}
				</select>
				<select bind:value={$state.skidsteers[id].reverseAxis2}>
					<option value={-1}>-</option>
					{#each Array($axes.length) as _, i}
						<option>{i}</option>
					{/each}
				</select>
			</li>

			<li class="row">
				<p class="label">Reversed:</p>
				<input class="checkbox" type="checkbox" bind:checked={$state.skidsteers[id].reversed} />
				<input class="checkbox" type="checkbox" bind:checked={$state.skidsteers[id].reversed2} />
			</li>

			<li class="row">
				<p class="label">Turn Axis:</p>
				<select bind:value={$state.skidsteers[id].turnAxis}>
					<option value={-1}>-</option>
					{#each Array($axes.length) as _, i}
						<option>{i}</option>
					{/each}
				</select>
				<select bind:value={$state.skidsteers[id].turnAxis2}>
					<option value={-1}>-</option>
					{#each Array($axes.length) as _, i}
						<option>{i}</option>
					{/each}
				</select>
			</li>
		</ul>
	{/if}
</div>

<style>
	.servocontents {
		display: flex;
		flex-direction: row;
		width: 100%;
	}

	.servocontents ul {
		padding: 0 0 0 0.5em;
	}

	.row {
		display: flex;
		justify-content: end;
		height: 2em;
	}

	.row p {
		margin: auto 0 auto 0;
		text-align: left;
	}

	.row .value {
		text-align: right;
		width: 3em;
	}

	.checkbox {
		min-width: 2.8em;
		margin: 0.5em;
	}
</style>
