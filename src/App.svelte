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
	<GamepadsCard/>
	<ServosCard/>
	<WebSocketCard/>
	Version: {SHA}
</div>

<script lang="ts">
	import GamepadsCard from "./GamepadsCard.svelte";
	import ServosCard from "./ServosCard.svelte";
	import WebSocketCard from "./WebSocketCard.svelte";
	import { SHA } from "./sha";

	const name: String = "Servo Dashboard";
</script>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
</style>