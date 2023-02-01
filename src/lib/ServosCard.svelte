<script lang="ts">
	import Servo from './Servo.svelte';
	import { state } from '$lib/stores/StateStore';
	import { pwms } from '$lib/stores/PWMStore';

	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
	import Card, { Actions, ActionButtons } from '@smui/card';
	import Button, { Label } from '@smui/button';
</script>

<Card>
	<Content>
		<Accordion multiple>
			{#if $state.servos}
				{#each $state.servos as servo, i}
					<Panel>
						<Header>
							{servo.name}:
							{servo.axis > 0 ? 'Axis ' + servo.axis : ''}
							{servo.buttonPlus > 0 ? '(+) ' + servo.buttonPlus : ''}
							{servo.buttonMinus > 0 ? '(-) ' + servo.buttonMinus : ''}
						</Header>
						<Content>
							<Servo {servo} pwm_i={i}/>
							<Button
								on:click={() => { $state.servos = $state.servos.filter((s) => s != servo) }}
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
					$state.servos = [
						...$state.servos,
						{
							name: 'Servo',
							id: $state.servos.length,
							axis: -1,
							min: 0,
							max: 255,
							startValue: 127,
							speed: 1.0,
							buttonPlus: -1,
							buttonMinus: -1,
							buttonSpeed: 0,
							centering: false,
							centerTrim: 0
						}
					];
				}}
				title="Add Servo"
				variant="outlined"
			>
				<Label>Add Servo</Label>
			</Button>
		</ActionButtons>
	</Actions>
</Card>
