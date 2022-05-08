<script lang="ts">
	import { state } from '$lib/stores/StateStore';
	import Button from '@smui/button';
	export let uuid: string;
</script>

<div class="container">
	<Button on:click={() => state.uploadState(uuid)}>Save</Button>
</div>

<style>
	.container {
		display: flex;
	}
</style>
