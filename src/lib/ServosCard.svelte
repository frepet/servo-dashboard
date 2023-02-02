<script lang="ts">
	import Servo from './Servo.svelte';
	import { state } from '$lib/stores/StateStore';
	import { axes } from '$lib/stores/AxesStore';
	import { buttons } from '$lib/stores/ButtonsStore';
	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
	import Card, { Actions, ActionButtons } from '@smui/card';
	import Button, { Label } from '@smui/button';
	import type { Servo as Servo_t } from '$lib/types';
	import { clamp } from '$lib/utils';
	import { onMount, onDestroy } from 'svelte';

	let poll: number;
	onMount(() => {
		const loop = () => {
			$state.servos.forEach((servo: Servo_t) => {
				let new_value = 0;
				if (servo.centering) {
					let invert = 1;
					if (servo.speed < 0) {
						invert = -1;
					}
					new_value = invert * $axes[servo.axis] * 127.5 + 127.5 + servo.centerTrim;
				} else {
					new_value += servo.value;
					if (servo.axis > -1) {
						new_value += ($axes[servo.axis] ?? 0) * servo.speed;
					}
					if (servo.buttonPlus > -1) {
						new_value += ($buttons[servo.buttonPlus] ? 1 : 0) * servo.buttonSpeed;
					}
					if (servo.buttonMinus > -1) {
						new_value -= ($buttons[servo.buttonMinus] ? 1 : 0) * servo.buttonSpeed;
					}
				}
				servo.value = clamp(new_value, servo.min, servo.max);
			});
			$state.servos = $state.servos;
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
			{#if $state.servos}
				{#each $state.servos as servo}
					<Panel>
						<Header>
							{servo.name}:
							{servo.axis >= 0 ? 'Axis ' + servo.axis : ''}
							{servo.buttonPlus >= 0 ? '(+) ' + servo.buttonPlus : ''}
							{servo.buttonMinus >= 0 ? '(-) ' + servo.buttonMinus : ''}
						</Header>
						<Content>
							<Servo bind:servo />
							<Button
								on:click={() => {
									$state.servos = $state.servos.filter((s) => s != servo);
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
					$state.servos = [
						...$state.servos,
						{
							name: 'Servo',
							id: $state.servos.length,
							axis: -1,
							min: 0,
							max: 255,
							value: 127,
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
