<script lang="ts">
	import logo from '$lib/assets/logo.png';
</script>

<div id="header">
	<img alt="Servo Dashboard Logo" src={logo} id="logo"/>
	<h1>Servo Dashboard</h1>
</div>

<div id="container">
	<slot />
</div>

<style>
	#header {
		display: flex;
		justify-content: flex-start;
		margin-bottom: 1rem;
		margin-top: 1rem;
		margin-left: 0rem;
	}
	#logo {
		width: 8em;
	}
	h1 {
		color: #db1c26;
		padding-left: 1rem;
		margin-top: auto;
		margin-bottom: auto;
		font-variant: small-caps;
		width: fit-content;
		height: fit-content;
		font-size: 3rem;
	}
	#container {
		width: fit-content;
	}
</style>
