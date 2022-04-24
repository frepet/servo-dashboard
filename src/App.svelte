<script lang="ts">
	import Controller from "./Controller.svelte";
	import Servo from "./Servo.svelte";

	const name: String = "Servo Dashboard";
</script>

<h1>{name}</h1>
<div class="container">
	<Controller/>
	<Servo axis={0}/>
	<Servo axis={1} speed={10}/>
</div>

<style>
	.container {
		display: flex;
		gap: 0.5rem;
	}
</style>