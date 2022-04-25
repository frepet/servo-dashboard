<script lang="ts">
	import Controller from "./Controller.svelte";
	import Output from "./Output.svelte";
	import Servo from "./Servo.svelte";

	const name: String = "Servo Dashboard";
</script>

<h1>{name}</h1>
<div class="container">
	<div class="cards">
		<Controller/>
		<Servo axis={0}/>
		<Servo axis={1} speed={10}/>
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
		gap: 0.5rem;
	}
</style>