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
	<span>Version: {SHA.substring(0, 8)} of <a href={githubUrl} target="_blank">servo-dashboard</a></span>
</div>

<script lang="ts">
	import GamepadsCard from "./GamepadsCard.svelte";
	import ServosCard from "./ServosCard.svelte";
	import WebSocketCard from "./WebSocketCard.svelte";
	import { SHA } from "./sha";

	const name = "Servo Dashboard";
	const githubUrl = "https://github.com/frepet/servo-dashboard";
</script>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
</style>