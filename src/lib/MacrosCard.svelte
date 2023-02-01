<script lang="ts">
	import Macro from './Macro.svelte';
	import { state } from '$lib/stores/StateStore';

	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
	import Card, { Actions, ActionButtons } from '@smui/card';
	import Button, { Label } from '@smui/button';
</script>

<Card>
	<Content>
		<Accordion multiple>
			{#if $state.macros}
				{#each $state.macros as macro, i}
					<Panel>
						<Header>
							{macro.name}:
						</Header>
						<Content>
							<Macro {macro}/>
							<Button
								on:click={() => { $state.macros = $state.macros.filter((_, j) => j != i) }}
								title="Remove"
								variant="outlined" >
								<Label>Remove</Label>
							</Button>
						</Content>
					</Panel>
				{/each}
			{/if}
		</Accordion>
	</Content>
	<Actions>
		<ActionButtons>
			<Button
				on:click={() => {
					$state.macros = [
						...$state.macros,
						{
							name: 'Macro',
							id: $state.macros.length,
							steps: [],
							button: -1,
						}
					];
				}}
				title="Add Macro"
				variant="outlined"
			>
				<Label>Add Macro</Label>
			</Button>
		</ActionButtons>
	</Actions>
</Card>
