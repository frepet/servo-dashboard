<script lang="ts">
	import { axes } from '$lib/stores/AxesStore';
	import { state } from '$lib/stores/StateStore';
	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
	import { onMount } from 'svelte';
	import { draw } from './draw';
	import { IK } from './IK';
	import Slider from '@smui/slider';
	import { buttons } from '$lib/stores/ButtonsStore';

	let context: any;
	let canvas: any;
	let IKobject: IK;

	onMount(() => {
		canvas = document.getElementById('canvas');
		context = canvas.getContext('2d');

		IKobject = new IK();
	});

	$: $state, addServoToIk();

	function addServoToIk() {
		if (IKobject == undefined) {
			return;
		}
		for (let i = IKobject.servos.length; i < 2; i++) {
			let servo = $state.servos.at(i);
			if (servo != undefined) {
				IKobject.addIKServo(servo);
			}
		}
	}

	function moveTarget() {
		let delta = 10; // TODO fix
		if (IKobject != undefined) {
			if (IKobject.targetXAxis != undefined && $axes[IKobject.targetXAxis]) {
				IKobject.target.x +=
					deadzone(IKobject.targetXAxis, $axes[IKobject.targetXAxis]) * IKobject.ikSpeedX * delta;
			}
			if (IKobject.targetYAxis != undefined && $axes[IKobject.targetYAxis]) {
				IKobject.target.y +=
					deadzone(IKobject.targetYAxis, $axes[IKobject.targetYAxis]) * IKobject.ikSpeedY * delta;
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

	$: $state, moveTarget();

	function update() {
		IKobject.update();
		draw(
			context,
			IKobject.servos,
			IKobject.base,
			IKobject.arm,
			IKobject.target,
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

			{#if IKobject != undefined && IKobject.servos.length == 2}
				<Panel>
					<Header>IK settings</Header>
					<Content>
						<Header>Speed settings</Header>
						<Content>
							<p>IK speed X: {IKobject.ikSpeedX}</p>
							<Slider
								bind:value={IKobject.ikSpeedX}
								min={-10}
								max={10}
								step={0.1}
								discrete
								tickMarks
								input$aria-label="IK speed X"
							/>
							<p>IK speed Y: {IKobject.ikSpeedY}</p>
							<Slider
								bind:value={IKobject.ikSpeedY}
								min={-10}
								max={10}
								step={0.1}
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
						<p>Arm: {IKobject.limbArm} mm</p>
						<Slider
							bind:value={IKobject.limbArm}
							min={0}
							max={1000}
							step={5}
							discrete
							tickMarks
							input$aria-label="Limb arm length (mm)"
						/>
						<h2>Limb forearm settings</h2>
						<p>Forearm: {IKobject.limbFore} mm</p>
						<Slider
							bind:value={IKobject.limbFore}
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
						<select bind:value={IKobject.targetXAxis}>
							<option value={-1}>-</option>
							{#each Array($buttons.length) as _, i}
								<option>{i}</option>
							{/each}
						</select>
						<p>Target axis Y:</p>
						<select bind:value={IKobject.targetYAxis}>
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
						<p>Midpoint: {IKobject.servoMidpointArm / Math.PI} &#960;</p>
						<Slider
							bind:value={IKobject.servoMidpointArm}
							min={-Math.PI * 2}
							max={Math.PI * 2}
							step={Math.PI / 2}
							discrete
							tickMarks
							input$aria-label="Servo midpoint arm"
						/>
						<p>Range: {IKobject.servoRangeArm / Math.PI} &#960;</p>
						<Slider
							bind:value={IKobject.servoRangeArm}
							min={-Math.PI * 2}
							max={Math.PI * 2}
							step={Math.PI / 2}
							discrete
							tickMarks
							input$aria-label="Servo range arm"
						/>
						<h2>Forearm settings</h2>
						<p>Midpoint: {IKobject.servoMidpointForeArm / Math.PI} &#960;</p>
						<Slider
							bind:value={IKobject.servoMidpointForeArm}
							min={-Math.PI * 2}
							max={Math.PI * 2}
							step={Math.PI / 2}
							discrete
							tickMarks
							input$aria-label="Servo midpoint arm"
						/>
						<p>Range: {IKobject.servoRangeForeArm / Math.PI} &#960;</p>
						<Slider
							bind:value={IKobject.servoRangeForeArm}
							min={-Math.PI * 2}
							max={Math.PI * 2}
							step={Math.PI / 2}
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
