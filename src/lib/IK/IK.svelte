<script lang="ts">
	import { axes } from '$lib/stores/AxesStore';
	import { state } from '$lib/stores/StateStore';
	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
	import { onMount } from 'svelte';
	import { draw } from './draw';
	import { IK } from './IK';
	import Slider from '@smui/slider';
	import { buttons } from '$lib/stores/ButtonsStore';
	import { Vec2 } from './vec2';
	import type { Servo as Servo_t } from '$lib/types';

	let context: any;
	let canvas: any;

	onMount(() => {
		canvas = document.getElementById('canvas');
		context = canvas.getContext('2d');
	});

	$: $state, addServoToIk();

	function addServoToIk() {
		if ($state.ik == undefined) {
			return;
		}
		for (let i = $state.ik.servos.length; i < 2; i++) {
			let servo = $state.servos.at(i);
			if (servo != undefined) {
				$state.ik.addIKServo(servo);
				$state.ik = $state.ik;
			}
		}
	}

	$: $state, moveTarget();

	function moveTarget() {
		let delta = 10; // TODO fix
		if ($state.ik != undefined) {
			if ($state.ik.targetXAxis != undefined && $axes[$state.ik.targetXAxis]) {
				$state.ik.target.x +=
					deadzone($state.ik.targetXAxis, $axes[$state.ik.targetXAxis]) *
					$state.ik.ikSpeedX/10 *
					delta;
			}
			if ($state.ik.targetYAxis != undefined && $axes[$state.ik.targetYAxis]) {
				$state.ik.target.y +=
					deadzone($state.ik.targetYAxis, $axes[$state.ik.targetYAxis]) *
					$state.ik.ikSpeedY/10 *
					delta;
			}
			update();
		}
	}
	function deadzone(axis: number, val: number) {
		if (Math.abs(val) < $state.deadzones[axis]) {
			return 0;
		}
		const adjusted = (Math.abs(val) - $state.deadzones[axis]) / (1 - $state.deadzones[axis]);
		return val > 0 ? adjusted : -adjusted;
	}

	function update() {
		if ($state.ik == undefined || canvas == undefined || context == undefined) {
			console.log('Hello world');
			return;
		}
		if (!($state.ik instanceof IK)) {
			console.log('Hello world');
			return;
		}
		// TODO add disable
		$state.ik.update();
		draw(
			context,
			$state.ik.servos,
			$state.ik.base,
			$state.ik.arm,
			$state.ik.target,
			canvas.width,
			canvas.height
		);
	}
</script>

<Accordion multiple>
	<Panel>
		<Header>IK</Header>
		<Content>
			<div id="canvas-card">
				<canvas height="500" id="canvas" width="1300" />
			</div>

			{#if $state.ik != undefined && $state.ik.servos.length == 2}
				<Panel>
					<Header>IK settings</Header>
					<Content>
						<Header>Speed settings</Header>
						<Content>
							<p>IK speed X: {$state.ik.ikSpeedX / 10}</p>
							<Slider
								bind:value={$state.ik.ikSpeedX} 
								min={-100}
								max={100}
								step={1}
								discrete
								tickMarks
								input$aria-label="IK speed X"
							/>
							
							<p>IK speed Y: {$state.ik.ikSpeedY / 10}</p>
							<Slider
								bind:value={$state.ik.ikSpeedY}
								min={-100}
								max={100}
								step={1}
								discrete
								tickMarks
								input$aria-label="IK speed Y"
							/>
						</Content>
					</Content>
				</Panel>
				<Panel>
					<Header>limbs settings</Header>
					<Content>
						<p>Arm: {$state.ik.limbArm} mm</p>
						<Slider
							bind:value={$state.ik.limbArm}
							min={0}
							max={1000}
							step={5}
							discrete
							tickMarks
							input$aria-label="Limb arm length (mm)"
						/>
						<h2>Limb forearm settings</h2>
						<p>Forearm: {$state.ik.limbFore} mm</p>
						<Slider
							bind:value={$state.ik.limbFore}
							min={0}
							max={1000}
							step={5}
							discrete
							tickMarks
							input$aria-label="Limb forearm length (mm)"
						/>
					</Content>
				</Panel>
				<Panel>
					<Header>Gamepad settings</Header>
					<Content>
						<p>Target axis X:</p>
						<select bind:value={$state.ik.targetXAxis}>
							<option value={-1}>-</option>
							{#each Array($buttons.length) as _, i}
								<option>{i}</option>
							{/each}
						</select>
						<p>Target axis Y:</p>
						<select bind:value={$state.ik.targetYAxis}>
							<option value={-1}>-</option>
							{#each Array($buttons.length) as _, i}
								<option>{i}</option>
							{/each}
						</select>
					</Content>
				</Panel>
				<Panel>
					<Header>Servo settings</Header>
					<Content>						
						<h2>Arm settings</h2>
						<p>Midpoint: {$state.ik.servoMidpointArm} &#176;</p>
						<Slider
							bind:value={$state.ik.servoMidpointArm}
							min={-360}
							max={360}
							step={1}
							discrete
							tickMarks
							input$aria-label="Servo midpoint arm"
						/>
						<p>Range: {$state.ik.servoRangeArm} &#176;</p>
						<Slider
							bind:value={$state.ik.servoRangeArm}
							min={-360}
							max={360}
							step={1}
							discrete
							tickMarks
							input$aria-label="Servo range arm"
						/>
						<h2>Forearm settings</h2>
						<p>Midpoint: {$state.ik.servoMidpointForeArm} &#176;</p>
						<Slider
							bind:value={$state.ik.servoMidpointForeArm}
							min={-360}
							max={360}
							step={1}
							discrete
							tickMarks
							input$aria-label="Servo midpoint arm"
						/>
						<p>Range: {$state.ik.servoRangeForeArm} &#176;</p>
						<Slider
							bind:value={$state.ik.servoRangeForeArm}
							min={-360}
							max={360}
							step={1}
							discrete
							tickMarks
							input$aria-label="Servo range arm"
						/>
						<p>servo Z?</p>
						<p>midpoint Z</p>
						<p>range Z</p>
					</Content>
				</Panel>
				<Panel>
					<Header>base settings</Header>
					<Content>
						<p>base</p>
					</Content>
				</Panel>
				<Panel>
					<Header>bounding box settings</Header>
					<Content>
						<p>constrainTarget</p>
					</Content>
				</Panel>
			{/if}
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
