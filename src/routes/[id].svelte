<script lang="ts">
	import type { State } from './[id]';

	export let state: State;
</script>

{#if state.name}
	<h1>{state.name}</h1>
{/if}

{#if state.uuid}
	<h4>{state.uuid}</h4>
{/if}

PWMs:
{#if state.pwms}
	<ol>
		{#each state.pwms as pwm}
			<li>{pwm}</li>
		{/each}
	</ol>
{/if}


Servos:
{#if state.servos}
	<ol>
		{#each state.servos as servo}
			<li>ID: {servo.id}, Axis: {servo.axis}, Speed: {servo.speed}, {servo.min}-{servo.max}, start: {servo.startValue}</li>
		{/each}
	</ol>
{/if}
