<script lang="ts">
	import { axes } from '$lib/stores/AxesStore';
	import { buttons } from '$lib/stores/ButtonsStore';
	import { state } from '$lib/stores/StateStore';
	import { localStore } from './stores/LocalStore';
	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
	import Group from '@smui/button/src/Group.svelte';
	let axis: number[] = [];
	let poll: number;
	let duplicateInput = false;
	let duplicateInputDebounce = false;

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
					if (!duplicateInput) {
						axis[axisi] = applyDeadzone(val, axisi);
						$axes[axisi] = axis[axisi];
					}
					axisi++;
				});
				if (duplicateInput) {
					pad.axes.forEach((val) => {
						axis[axisi] = applyDeadzone(val, axisi);
						$axes[axisi] = axis[axisi];
						axisi++;
					});
				}

				pad.buttons.forEach(({ pressed }) => {
					if (!duplicateInputDebounce && buttonsi == $state.swapButton && pressed) {
						duplicateInput = !duplicateInput;
						$localStore.mode = duplicateInput ? 1 : 0;
						duplicateInputDebounce = true;
					} else if (buttonsi == $state.swapButton && !pressed) {
						duplicateInputDebounce = false;
					}
					if (!duplicateInput) {
						$buttons[buttonsi] = pressed;
					}
					buttonsi++;
				});
				pad.buttons.forEach(({ pressed }) => {
					if (duplicateInput) {
						$buttons[buttonsi] = pressed;
					}
					buttonsi++;
				});
			}
		});

		poll = requestAnimationFrame(startController);
	};
</script>

<svelte:window on:gamepadconnected={plugIn} on:gamepaddisconnected={plugOut} />

<Accordion multiple>
	<Panel>
		<Header>Gamepad: {duplicateInput ? 'DUP' : ''}</Header>
		<Content>
			<ul>
				<li class='row'>
					<p class="label">Duplicate Button:</p>
					<select bind:value={$state.swapButton}>
						<option value={-1}>-</option>
						{#each Array($buttons.length) as _, i}
							<option>{i}</option>
						{/each}
					</select>
				</li>
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
