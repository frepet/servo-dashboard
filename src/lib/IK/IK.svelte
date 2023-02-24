<script lang="ts">
	import { axes } from '$lib/stores/AxesStore';
	import { state } from '$lib/stores/StateStore';
	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
	import { onMount } from 'svelte';
	import { draw } from './draw';
	import { IK } from './IK';

	let context: any;
	let canvas: any;
	let IKobject: IK;

	//TODO fix deadzones
	let deadzones: number[] = [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2];

	onMount(() => {
		canvas = document.getElementById('canvas');
		console.log(canvas);
		context = canvas.getContext('2d');
		console.log(context);

		IKobject = new IK();
	});

	$: $state, addServoToIk();

	function addServoToIk() {
		if (IKobject == undefined) {
			return;
		}
		if ($state.servos.length <= 2 && $state.servos.length > IKobject.servos.length) {
			let servo = $state.servos.at(IKobject.servos.length);
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
					deadzone(IKobject.targetXAxis, $axes[IKobject.targetXAxis]) * IKobject.ikSpeed[0] * delta;
			}
			if (IKobject.targetYAxis != undefined && $axes[IKobject.targetYAxis]) {
				IKobject.target.y +=
					deadzone(IKobject.targetYAxis, $axes[IKobject.targetYAxis]) * IKobject.ikSpeed[1] * delta;
			}
			update();
		}
	}
	function deadzone(axis: number, val: number) {
		if (Math.abs(val) < deadzones[axis]) {
			return 0;
		}
		const adjusted = (Math.abs(val) - deadzones[axis]) / (1 - deadzones[axis]);
		return val > 0 ? adjusted : -adjusted;
	}

	$: $state, moveTarget();

	function update() {
		IKobject.update();
		console.log(IKobject.servos[0]);
		console.log(IKobject.servos[1]);
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
			<Panel>
				<Header>IK settings</Header>
				<Content>
					<p>ikSpeed</p>
				</Content>
			</Panel>
			<Panel>
				<Header>limbs settings</Header>
				<Content>
					<p>limbs (mm)</p>
				</Content>
			</Panel>
			<Panel>
				<Header>Gamepad settings</Header>
				<Content>
					<p>Target axis</p>
				</Content>
			</Panel>
			<Panel>
				<Header>Servo settings</Header>
				<Content>
					<p>servo X</p>
					<p>midpoint X</p>
					<p>range X</p>
					<p>servo Y</p>
					<p>midpoint Y</p>
					<p>range Y</p>
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
