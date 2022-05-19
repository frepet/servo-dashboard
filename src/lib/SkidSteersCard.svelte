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
				{#each $state.skidsteers as motor}
					<Panel>
						<Header>
							Skid Steer {motor.id}: Axes
							{motor.forwardAxis},
							{motor.reverseAxis},
							{motor.turnAxis}
						</Header>
						<Content>
							<SkidSteer id={motor.id} />
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
							turnAxis: -1,
							speed: 1,
							turnSpeed: 1,
							reversed: false
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
