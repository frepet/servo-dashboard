<script lang="ts">
	import { state } from '$lib/stores/StateStore';
	import Button from '@smui/button';
	import Card, { Actions, Content } from '@smui/card';
	export let uuid: string;
</script>

<Card>
	<Content>State: {$state.name}</Content>
	<Actions>
		<Button id="save" on:click={() => state.uploadState(uuid)} variant="outlined">Save</Button>
	</Actions>
</Card>