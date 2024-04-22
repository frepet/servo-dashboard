<script lang="ts">
	import Motor from './Motor.svelte';
	import { state } from '$lib/stores/StateStore';
	import { axes } from '$lib/stores/AxesStore';
	import { buttons } from '$lib/stores/ButtonsStore';
	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
	import Card, { Actions, ActionButtons } from '@smui/card';
	import Button, { Label } from '@smui/button';
	import type { Motor as Motor_t } from '$lib/types';
	import { clamp } from '$lib/utils';
	import { onMount, onDestroy } from 'svelte';

	const expF = (value: number, strength: number) => {
		let expf = Math.abs(Math.pow(value, 1 + strength * 2));
		return value > 0 ? expf : -expf;
	};

	let poll: number;
	onMount(() => {
		const loop = () => {
			$state.motors.forEach((motor: Motor_t) => {
				let new_value = motor.value;
				if (motor.axis >= 0 || motor.buttonMinus >= 0 || motor.buttonPlus >= 0) {
					new_value = 0;
				}

				if (motor.mixins.length > 0) {
					new_value = 0;
					motor.mixins.forEach((mixin) => {
						if ($state.motors[mixin.servo]) {
							new_value += $state.motors[mixin.servo].value * mixin.multiplier + mixin.offset;
						}
					});
				}

				if (motor.axis > -1) {
					new_value += expF($axes[motor.axis] ?? 0, motor.exp) * 100 * (motor.reverseAxis ? -1 : 1);
				}
				if (motor.buttonPlus > -1) {
					new_value += ($buttons[motor.buttonPlus] ? 1 : 0) * 100;
				}
				if (motor.buttonMinus > -1) {
					new_value -= ($buttons[motor.buttonMinus] ? 1 : 0) * 100;
				}

				motor.value = clamp(new_value, motor.min, motor.max);
			});

			$state.motors = $state.motors;
			poll = requestAnimationFrame(loop);
		};

		loop();
	});
	if (typeof window !== 'undefined') {
		onDestroy(() => cancelAnimationFrame(poll));
	}
</script>

<Card>
	<Content>
		<Accordion multiple>
			{#if $state.motors}
				{#each $state.motors as motor}
					<Panel>
						<Header>
							{motor.name}:
							{motor.axis >= 0 ? 'Axis ' + motor.axis : ''}
							{motor.buttonPlus >= 0 ? '(+) ' + motor.buttonPlus : ''}
							{motor.buttonMinus >= 0 ? '(-) ' + motor.buttonMinus : ''}
						</Header>
						<Content>
							<Motor bind:motor />
							<Button
								on:click={() => {
									motor.mixins.push({
										servo: 0,
										offset: 0,
										multiplier: 1.0
									});
								}}
								title="Add Mixin"
								variant="outlined"
							>
								<Label>Add Mixin</Label>
							</Button>
							<Button
								on:click={() => {
									$state.motors = $state.motors.filter((s) => s != motor);
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
					$state.motors = [
						...$state.motors,
						{
							name: 'Motor',
							id: $state.motors.length,
							axis: -1,
							reverseAxis: false,
							min: -100,
							max: 100,
							value: 0,
							exp: 1,
							buttonPlus: -1,
							buttonMinus: -1,
							mixins: []
						}
					];
				}}
				title="Add Motor"
				variant="outlined"
			>
				<Label>Add Motor</Label>
			</Button>
		</ActionButtons>
	</Actions>
</Card>
