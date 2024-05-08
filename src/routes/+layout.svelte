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
	#container, #header{
		font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
	}
	#header {
		display: flex;
		justify-content: flex-start;
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
