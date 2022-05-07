<script lang="ts">
	import { state } from '$lib/stores/StateStore';
	export let uuid: string;
</script>

<div class="container">
	<button on:click={() => state.uploadState(uuid)}>Save</button>
</div>

<style>
	.container {
		display: flex;
	}
</style>
