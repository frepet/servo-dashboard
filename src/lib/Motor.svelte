<script lang="ts">
	import { axes } from '$lib/stores/AxesStore';
	import { buttons } from '$lib/stores/ButtonsStore';
	import type { Motor as Motor_t } from '$lib/types';

	export let motor: Motor_t;
</script>

{#if motor}
	Name: <input bind:value={motor.name} />
	<div class="motorcontents">
		<ul>
			<li class="row">
				<p class="label">Speed</p>
				<p class="value">{Math.round(motor.value)}</p>
				<input class="slider" type="range" min="-100" max="100" step={1} bind:value={motor.value} />
			</li>

			<li class="row">
				<p class="label">Min</p>
				<p class="value">{motor.min}</p>
				<input class="slider" type="range" min={-100} max={100} step={1} bind:value={motor.min} />
			</li>

			<li class="row">
				<p class="label">Max</p>
				<p class="value">{motor.max}</p>
				<input class="slider" type="range" min={-100} max={100} step={1} bind:value={motor.max} />
			</li>
		</ul>

		<ul>
			<li class="row">
				<p class="label">Axis:</p>
				<select bind:value={motor.axis}>
					<option value={-1}>-</option>
					{#each Array($axes.length) as _, i}
						<option>{i}</option>
					{/each}
				</select>
			</li>

			<li class="row">
				<p class="label">Exp:</p>
				<input class="valueInput" type="number" step={0.1} disabled bind:value={motor.exp} />
			</li>

			<li class="row">
				<p class="label">Reversed:</p>
				<input class="checkbox" type="checkbox" bind:checked={motor.reverseAxis} />
			</li>
		</ul>

		<ul>
			<li class="row">
				<p class="label">Button(+):</p>
				<select bind:value={motor.buttonPlus}>
					<option value={-1}>-</option>
					{#each Array($buttons.length) as _, i}
						<option>{i}</option>
					{/each}
				</select>
			</li>

			<li class="row">
				<p class="label">Button(-):</p>
				<select bind:value={motor.buttonMinus}>
					<option value={-1}>-</option>
					{#each Array($buttons.length) as _, i}
						<option>{i}</option>
					{/each}
				</select>
			</li>
		</ul>

		<ul>
			Mixins:
			{#each motor.mixins as mixin}
				<li class="row">
					<p class="label">Motor:</p>
					<input class="valueInput" type="number" step={1} min="0" bind:value={mixin.servo} />
					<p class="label">Offset:</p>
					<input class="valueInput" type="number" step={1} bind:value={mixin.offset} />
					<p class="label">Multiplier:</p>
					<input class="valueInput" type="number" step={0.1} bind:value={mixin.multiplier} />
				</li>
			{/each}
		</ul>
	</div>
{/if}

<style>
	.motorcontents {
		display: flex;
		flex-direction: row;
		width: 100%;
	}

	.motorcontents ul {
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
