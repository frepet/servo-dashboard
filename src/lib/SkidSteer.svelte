<script lang="ts">
	import { axes } from '$lib/stores/AxesStore';
	import { motors } from '$lib/stores/MotorsStore';
	import { state } from '$lib/stores/StateStore';
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
			if (
				motorState.forwardAxis > -1 &&
				$axes[motorState.forwardAxis] != undefined &&
				$axes[motorState.reverseAxis] != undefined &&
				$axes[motorState.turnAxis] != undefined
			) {
				let throttle = 0;
				if (motorState.forwardAxis === motorState.reverseAxis) {
					throttle = $axes[motorState.forwardAxis];
				} else {
					throttle = (motorState.speed * ($axes[motorState.forwardAxis] - $axes[motorState.reverseAxis])) / 2;
				}
				if (motorState.reversed) {
					throttle *= -1;
				}
				const [left, right] = skidSteer(
					throttle,
					motorState.turnSpeed * $axes[motorState.turnAxis]
				);
				$motors[leftMotor] = left;
				$motors[rightMotor] = right;
			} else {
				$motors[id] = clamp($motors[id], -1, motorState.speed);
			}
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
			</li>

			<li class="row">
				<p class="label">Reverse Axis:</p>
				<select bind:value={$state.skidsteers[id].reverseAxis}>
					<option value={-1}>-</option>
					{#each Array($axes.length) as _, i}
						<option>{i}</option>
					{/each}
				</select>
			</li>
			
			<li class="row">
				<p class="label">Reversed:</p>
				<input class="valueInput" type="checkbox" bind:checked={$state.skidsteers[id].reversed} />
			</li>

			<li class="row">
				<p class="label">Turn Axis:</p>
				<select bind:value={$state.skidsteers[id].turnAxis}>
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
</style>
