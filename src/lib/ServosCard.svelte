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

	const expF = (value: number, strength: number) => {
		let expf = Math.abs(Math.pow(value, 1 + strength * 2));
		return value > 0 ? expf : -expf;
	};

	let poll: number;
	onMount(() => {
		const loop = () => {
			$state.servos.forEach((servo: Servo_t) => {
				let new_value = servo.value;

				if (servo.centering) {
					new_value = 127 + servo.centerTrim;
				}

				if (servo.mixins.length > 0) {
					new_value = 127;
					servo.mixins.forEach((mixin) => {
						if ($state.servos[mixin.servo]) {
							new_value +=
								($state.servos[mixin.servo].value - 127) * mixin.multiplier + mixin.offset;
						}
					});
				}

				if (servo.axis > -1) {
					new_value += expF($axes[servo.axis] ?? 0, servo.exp) * servo.speed;
				}
				if (servo.buttonPlus > -1) {
					new_value += ($buttons[servo.buttonPlus] ? 1 : 0) * servo.buttonSpeed;
				}
				if (servo.buttonMinus > -1) {
					new_value -= ($buttons[servo.buttonMinus] ? 1 : 0) * servo.buttonSpeed;
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
									servo.mixins.push({
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
							exp: 1,
							speed: 1.0,
							buttonPlus: -1,
							buttonMinus: -1,
							buttonSpeed: 0,
							centering: false,
							centerTrim: 0,
							mixins: []
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
