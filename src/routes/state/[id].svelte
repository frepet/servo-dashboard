<script lang="ts">
	import type { State } from './[id]';

	export let state: State;
</script>

<h1>{state.name}</h1>
<h4>{state.uuid}</h4>
PWMs:
<ol>
	{#each state.pwms as pwm}
		<li>{pwm}</li>
	{/each}
</ol>
Servos:
<ol>
	{#each state.servos as servo}
		<li>ID: {servo.id}, Axis: {servo.axis}, Speed: {servo.speed}, {servo.min}-{servo.max}, start: {servo.startValue}</li>
	{/each}
</ol>