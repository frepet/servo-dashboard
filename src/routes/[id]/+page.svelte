<script lang="ts">
	import type { State } from '$lib/types';
	import { state as stateStore } from '$lib/stores/StateStore';
	import StateCard from '$lib/StateCard.svelte';
	import GamepadsCard from '$lib/GamepadsCard.svelte';
	import ServosCard from '$lib/ServosCard.svelte';
	import MotorsCard from '$lib/MotorsCard.svelte';
	import MacrosCard from '$lib/MacrosCard.svelte';
	import WebSocketCard from '$lib/WebSocketCard.svelte';
	import IK from '$lib/IK/IK.svelte';
	import { IK as IK_OBJECT } from '$lib/IK/IK';
	import { onMount } from 'svelte';
	import { Vec2 } from '$lib/IK/vec2';
	import Settings from '$lib/Settings.svelte';
	import IFrameCard from '$lib/IFrameCard.svelte';
	import MecanumCard from '$lib/MecanumCard.svelte';
	import MqttCard from '$lib/MQTTCard.svelte';

	export let data: any;
	let state: State;
	let uuid: string;

	onMount(() => {
		state = data.body.state;
		uuid = data.body.uuid;
		if (!(state.ik instanceof IK_OBJECT)) {
			state.ik = Object.assign(new IK_OBJECT(), state.ik);

			state.ik.target = new Vec2(state.ik.target.x, state.ik.target.y);
			state.ik.base = new Vec2(state.ik.base.x, state.ik.base.y);

			for (let i = 0; i < state.ik.arm.length; i++) {
				state.ik.arm[i] = new Vec2(state.ik.arm[i].x, state.ik.arm[i].y);
			}
			state.ik.servos = [];
		}

		stateStore.set(state);
	});
</script>

<div class="container">
	{#if state != undefined}
		<StateCard {uuid} />
		<Settings />
		{#if $stateStore.settings.IFrameEnabled} <IFrameCard /> {/if}
		{#if $stateStore.settings.IKEnabled} <IK /> {/if}
		<GamepadsCard />
		<ServosCard />
		<MotorsCard />
		<MecanumCard />
		<MacrosCard />
		<MqttCard />
		<WebSocketCard />
	{/if}
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
</style>
