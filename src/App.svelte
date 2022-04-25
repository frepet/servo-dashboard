<script lang="ts">
	import Controller from "./Controller.svelte";
	import Output from "./Output.svelte";
	import Servo from "./Servo.svelte";

	const name: String = "Servo Dashboard";
	let servos = [0, 1, 2, 3];
	let nextID = 4;
</script>

<h1>{name}</h1>
<div class="container">
	<Controller/>
	<div class="cards">

		{#each servos as id}
			<Servo {id}/>
		{/each}

		<button on:click={() => {
			servos = [...servos, nextID];
			nextID++;
		}}>+</button>

	</div>
	<Output url="ws://localhost:22022"/>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.cards {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
</style>