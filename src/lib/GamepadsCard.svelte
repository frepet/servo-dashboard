<script lang="ts">
	import { axes } from '$lib/stores/AxesStore';
	import { buttons } from '$lib/stores/ButtonsStore';
	import { state } from '$lib/stores/StateStore';
	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
	import Group from '@smui/button/src/Group.svelte';
	let axis: number[] = [];
	let poll: number;

	const plugIn = () => {
		startController();
		state.update((state) => state);
	};

	const plugOut = () => {
		cancelAnimationFrame(poll);
		state.update((state) => state);
	};

	const applyDeadzone: (val: number, i: number) => number = (val, i) => {
		if ($state.deadzones[i] === undefined) {
			$state.deadzones[i] = 0;
		}
		if (Math.abs(val) > $state.deadzones[i]) {
			return (val - (Math.abs(val) / val) * $state.deadzones[i]) / (1 - $state.deadzones[i]);
		} else {
			return 0;
		}
	};

	const startController = () => {
		const gamepads = navigator.getGamepads();
		if (!gamepads) {
			return;
		}

		let axisi = 0;
		let buttonsi = 0;
		gamepads.forEach( pad =>  {
			if (pad) {
				pad.axes.forEach((val) => {
					axis[axisi] = applyDeadzone(val, axisi);
					$axes[axisi] = axis[axisi];
					axisi++;
				});
				pad.buttons.forEach(({ pressed }) => {
					$buttons[buttonsi] = pressed;
					buttonsi++;
				});
			}
		})

		poll = requestAnimationFrame(startController);
	};
</script>

<svelte:window on:gamepadconnected={plugIn} on:gamepaddisconnected={plugOut} />

<Accordion multiple>
	<Panel>
		<Header>Gamepad 0</Header>
		<Content>
			<ul>
				{#each axis as value, i}
					<li class="row">
						<p class="label">{i}</p>
						<input class="slider" type="range" min={-1} max={1} step={0.01} {value} disabled />
						<p class="value">{value.toFixed(2)}</p>
						<input type="number" min={0} max={1} step={0.05} bind:value={$state.deadzones[i]} />
					</li>
				{/each}
			</ul>
			<Group>
				{#each $buttons as pressed, i}
					<div class={'button' + (pressed ? ' pressed' : '')}>{i}</div>
				{/each}
			</Group>
		</Content>
	</Panel>
</Accordion>

<style>
	.row {
		display: flex;
		height: 2em;
	}

	.row p {
		margin: auto 0 auto 0;
	}

	.row .value {
		min-width: 4em;
	}

	.button {
		border-radius: 0.5em;
		border: solid #676778 1px;
		width: 2em;
		text-align: center;
		padding: 0.3em 0 0.5em 0;
	}

	.pressed {
		background-color: #ff3e00;
	}

	.label {
		min-width: 1.5em;
		text-align: right;
	}
</style>
