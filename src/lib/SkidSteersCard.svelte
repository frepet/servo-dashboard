<script lang="ts">
	import SkidSteer from '$lib/SkidSteer.svelte';
	import { state } from '$lib/stores/StateStore';

	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
	import Card, { Actions, ActionButtons } from '@smui/card';
	import Button, { Label } from '@smui/button';
</script>

<Card>
	<Content>
		<Accordion multiple>
			{#if $state.skidsteers}
				{#each $state.skidsteers as motor, i}
					<Panel>
						<Header>
							Skid Steer {motor.id}: Axes
							{motor.forwardAxis},
							{motor.reverseAxis},
							{motor.turnAxis}
						</Header>
						<Content>
							<SkidSteer id={motor.id} />
							<Button
								on:click={() => { $state.skidsteers = $state.skidsteers.filter((_, j) => j != i) }}
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
					$state.skidsteers = [
						...$state.skidsteers,
						{
							id: $state.skidsteers.length,
							forwardAxis: -1,
							reverseAxis: -1,
							forwardAxis2: -1,
							reverseAxis2: -1,
							turnAxis: -1,
							turnAxis2: -1,
							speed: 1,
							turnSpeed: 1,
							reversed: false,
							reversed2: false
						}
					];
				}}
				title="Add SkidSteer"
				variant="outlined"
			>
				<Label>Add SkidSteer</Label>
			</Button>
		</ActionButtons>
	</Actions>
</Card>
