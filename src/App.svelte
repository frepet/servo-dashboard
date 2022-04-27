<script lang="ts">
	import GamepadCard from "./GamepadCard.svelte";
	import WebSocketCard from "./WebSocketCard.svelte";
	import ServoCard from "./ServoCard.svelte";

	const name: String = "Servo Dashboard";
	let servos = [0, 1, 2, 3];
	let nextID = 4;
</script>

<div class="container">
	<h1>{name}</h1>

	<GamepadCard/>

	<div class="servos">
		{#each servos as id}
			<ServoCard {id}/>
		{/each}

		<button on:click={() => { servos = [...servos, nextID]; nextID++;}}>+</button>
	</div>

	<WebSocketCard/>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.servos {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
</style>