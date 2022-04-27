<script lang="ts">
	import GamepadCard from "./GamepadCard.svelte";
	import WebSocketCard from "./WebSocketCard.svelte";
	import ServoCard from "./ServoCard.svelte";

    import Accordion, { Panel, Header, Content } from "@smui-extra/accordion";

	const name: String = "Servo Dashboard";
	let servos = [0, 1, 2, 3];
	let nextID = 4;
	let selectedServo: ServoCard;
</script>

<!-- SMUI Styles -->
<link
  rel="stylesheet"
  href="build/smui.css"
  media="(prefers-color-scheme: light)"
/>
<link
  rel="stylesheet"
  href="build/smui-dark.css"
  media="screen and (prefers-color-scheme: dark)"
/>

<div class="container">
	<h1>{name}</h1>

	<GamepadCard/>

	<Accordion multiple>
		{#each servos as id}
		<Panel>
			<Header>Servo {id}</Header>
			<Content>
				<ServoCard {id}/>
			</Content>
		</Panel>
		{/each}

		<button on:click={() => { servos = [...servos, nextID]; nextID++;}}>+</button>
	</Accordion>

	<WebSocketCard/>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
</style>