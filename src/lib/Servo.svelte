<script lang="ts">
	import { axes } from '$lib/stores/AxesStore';
	import { buttons } from '$lib/stores/ButtonsStore';
	import { pwms } from '$lib/stores/PWMStore';
	import { state } from '$lib/stores/StateStore';
	import { clamp } from '$lib/utils';
	import { onDestroy } from 'svelte';

	export let id = 0;

	let startValue = 127;

	$pwms[id] = startValue;

	let poll: number;
	const loop = () => {
		if ($state.servos) {
			if ($state.servos[id].axis > -1) {
				$pwms[id] += ($axes[$state.servos[id].axis] ?? 0) * $state.servos[id].speed;
			}
			if ($state.servos[id].buttonPlus > -1) {
				$pwms[id] += ($buttons[$state.servos[id].buttonPlus] ? 1 : 0) * $state.servos[id].buttonSpeed;
			}
			if ($state.servos[id].buttonMinus > -1) {
				$pwms[id] -= ($buttons[$state.servos[id].buttonMinus] ? 1 : 0) * $state.servos[id].buttonSpeed;
			}
			$pwms[id] = clamp($pwms[id], $state.servos[id].min, $state.servos[id].max);
		}
		poll = requestAnimationFrame(loop);
	};
	loop();

	onDestroy(() => cancelAnimationFrame(poll));
</script>

<div class="servocontents">
	{#if $state.servos[id]}
		<ul>
			<li class="row">
				<p class="label">PWM</p>
				<p class="value">{Math.round($pwms[id])}</p>
				<input class="slider" type="range" min="0" max="255" step={1} bind:value={$pwms[id]} />
			</li>

			<li class="row">
				<p class="label">Min</p>
				<p class="value">{$state.servos[id].min}</p>
				<input
					class="slider"
					type="range"
					min={0}
					max={255}
					step={1}
					bind:value={$state.servos[id].min}
				/>
			</li>

			<li class="row">
				<p class="label">Max</p>
				<p class="value">{$state.servos[id].max}</p>
				<input
					class="slider"
					type="range"
					min={0}
					max={255}
					step={1}
					bind:value={$state.servos[id].max}
				/>
			</li>
		</ul>

		<ul>
			<li class="row">
				<p class="label">Axis:</p>
				<select bind:value={$state.servos[id].axis}>
					<option value={-1}>-</option>
					{#each Array($axes.length) as _, i}
						<option>{i}</option>
					{/each}
				</select>
			</li>

			<li class="row">
				<p class="label">Speed:</p>
				<input class="valueInput" type="number" step={0.1} bind:value={$state.servos[id].speed} />
			</li>
		</ul>

		<ul>
			<li class="row">
				<p class="label">Button(+):</p>
				<select bind:value={$state.servos[id].buttonPlus}>
					<option value={-1}>-</option>
					{#each Array($buttons.length) as _, i}
						<option>{i}</option>
					{/each}
				</select>
			</li>

			<li class="row">
				<p class="label">Button(-):</p>
				<select bind:value={$state.servos[id].buttonMinus}>
					<option value={-1}>-</option>
					{#each Array($buttons.length) as _, i}
						<option>{i}</option>
					{/each}
				</select>
			</li>

			<li class="row">
				<p class="label">Speed:</p>
				<input class="valueInput" type="number" step={0.1} bind:value={$state.servos[id].buttonSpeed} />
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
		justify-content: space-between;
		height: 2em;
	}

	.row p {
		margin: auto 0 auto 0;
	}

	.row .value {
		text-align: right;
		width: 3em;
	}

	.row .valueInput {
		width: 3em;
	}
</style>
