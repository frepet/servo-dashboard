<script lang="ts">
	import { state } from '$lib/stores/StateStore';
	import Button from '@smui/button';
	export let uuid: string;
</script>

<div class="container">
	<h2>{$state.name}</h2>
	<div id="save">
		<Button id="save" on:click={() => state.uploadState(uuid)} variant="raised">Save</Button>
	</div>
</div>

<style>
	h2 {
		margin-right: 1rem;
	}
	.container {
		display: flex;
	}
	#save {
		margin-top: auto;
		margin-bottom: auto;
	}
</style>
