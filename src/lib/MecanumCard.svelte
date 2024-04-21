<script lang="ts">
	import Mecanum from '$lib/Mecanum.svelte';
	import { state } from '$lib/stores/StateStore';

	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
	import Card, { Actions, ActionButtons } from '@smui/card';
	import Button, { Label } from '@smui/button';
</script>

<Card>
	<Content>
		<Accordion multiple>
			{#if $state.mecanumsteers}
				{#each $state.mecanumsteers as mecanumsteer, i}
					<Panel>
						<Header>
							Mecanum Steer {mecanumsteer.id}: Axes
							{mecanumsteer.forwardAxis},
							{mecanumsteer.strafeAxis},
							{mecanumsteer.rotationAxis}
						</Header>
						<Content>
							<Mecanum id={mecanumsteer.id} />
							<Button
								on:click={() => {
									$state.mecanumsteers = $state.mecanumsteers.filter((_, j) => j != i);
								}}
								title="Remove"
								variant="outlined"
							>
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
					$state.mecanumsteers = [
						...$state.mecanumsteers,
						{
							id: $state.skidsteers.length,
							forwardAxis: -1,
							strafeAxis: -1,
							rotationAxis: -1,
							forwardAxisReversed: false,
							strafeAxisReversed: false,
							rotationAxisReversed: false,
							forwardSpeed: 1.0,
							strafeSpeed: 1.0,
							rotationSpeed: 1.0
						}
					];
				}}
				title="Add Mecanum Steer"
				variant="outlined"
			>
				<Label>Add Mecanum Steer</Label>
			</Button>
		</ActionButtons>
	</Actions>
</Card>
