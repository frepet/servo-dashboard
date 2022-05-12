<script lang="ts">
	import { state } from '$lib/stores/StateStore';
	import Button from '@smui/button';
	export let uuid: string;
</script>

<h2>{$state.name}</h2>
<div class="container">
	<Button on:click={() => state.uploadState(uuid)} variant="raised">Save</Button>
</div>

<style>
	h2 {
		margin-top: 0px;
	}
	.container {
		display: flex;
	}
</style>
