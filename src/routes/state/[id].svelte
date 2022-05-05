<script lang="ts">
	import type { State } from './[id]';

	export let state: State;
	console.log(state);
	
</script>

<h1>{state.name}</h1>
<h4>{state.uuid}</h4>
PWM:
<ol>
	{#each state.pwms as pwm}
		<li>{pwm}</li>
	{/each}
</ol>