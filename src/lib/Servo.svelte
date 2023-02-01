<script lang="ts">
	import { axes } from '$lib/stores/AxesStore';
	import { buttons } from '$lib/stores/ButtonsStore';
	import { state } from '$lib/stores/StateStore';
	import { pwms } from '$lib/stores/PWMStore';
	import { clamp } from '$lib/utils';
	import { onDestroy } from 'svelte';
	import type { Servo as Servo_t } from '$lib/types';

	export let servo: Servo_t
	export let pwm_i: number

	let poll: number;
	const loop = () => {
		if ($state.servos) {
			if (servo.centering) {
				let invert = 1;
				if (servo.speed < 0) {
					invert = -1;
				}
				$pwms[pwm_i] = invert * $axes[servo.axis] * 127.5 + 127.5 + servo.centerTrim;
			} else {
				if (servo.axis > -1) {
					$pwms[pwm_i] += ($axes[servo.axis] ?? 0) * servo.speed;
				}
				if (servo.buttonPlus > -1) {
					$pwms[pwm_i] += ($buttons[servo.buttonPlus] ? 1 : 0) * servo.buttonSpeed;
				}
				if (servo.buttonMinus > -1) {
					$pwms[pwm_i] -= ($buttons[servo.buttonMinus] ? 1 : 0) * servo.buttonSpeed;
				}
			}
			$pwms[pwm_i] = clamp($pwms[pwm_i], servo.min, servo.max);
		}
		poll = requestAnimationFrame(loop);
	};
	loop();

	onDestroy(() => cancelAnimationFrame(poll));
</script>

{#if servo}
	Name: <input bind:value={servo.name} />
	<div class="servocontents">
		<ul>
			<li class="row">
				<p class="label">PWM</p>
				<p class="value">{Math.round($pwms[pwm_i])}</p>
				<input class="slider" type="range" min="0" max="255" step={1} bind:value={$pwms[pwm_i]} />
			</li>

			<li class="row">
				<p class="label">Min</p>
				<p class="value">{servo.min}</p>
				<input
					class="slider"
					type="range"
					min={0}
					max={255}
					step={1}
					bind:value={servo.min}
				/>
			</li>

			<li class="row">
				<p class="label">Max</p>
				<p class="value">{servo.max}</p>
				<input
					class="slider"
					type="range"
					min={0}
					max={255}
					step={1}
					bind:value={servo.max}
				/>
			</li>
		</ul>

		<ul>
			<li class="row">
				<p class="label">Axis:</p>
				<select bind:value={servo.axis}>
					<option value={-1}>-</option>
					{#each Array($axes.length) as _, i}
						<option>{i}</option>
					{/each}
				</select>
			</li>

			<li class="row">
				<p class="label">Speed:</p>
				<input class="valueInput" type="number" step={0.1} bind:value={servo.speed} />
			</li>
		</ul>

		<ul>
			<li class="row">
				<p class="label">Button(+):</p>
				<select bind:value={servo.buttonPlus}>
					<option value={-1}>-</option>
					{#each Array($buttons.length) as _, i}
						<option>{i}</option>
					{/each}
				</select>
			</li>

			<li class="row">
				<p class="label">Button(-):</p>
				<select bind:value={servo.buttonMinus}>
					<option value={-1}>-</option>
					{#each Array($buttons.length) as _, i}
						<option>{i}</option>
					{/each}
				</select>
			</li>

			<li class="row">
				<p class="label">Speed:</p>
				<input
					class="valueInput"
					type="number"
					step={0.1}
					bind:value={servo.buttonSpeed}
				/>
			</li>
		</ul>

		<ul>
			<li class="row">
				<p class="label">Centering:</p>
				<input class="valueInput" type="checkbox" bind:checked={servo.centering} />
			</li>
			<li class="row">
				<p class="label">Trim:</p>
				<input
					class="valueInput"
					type="number"
					step={1}
					bind:value={servo.centerTrim}
				/>
			</li>
		</ul>
	</div>
{/if}

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
