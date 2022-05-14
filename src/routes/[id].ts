import type { State } from '$lib/types';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ params, locals }) => {
	let state: State;

	try {
		const resp = await locals.dbc.one('SELECT state FROM states WHERE uuid = $1', [params.id]);
		state = backwardsCompatability(resp['state']);
	} catch (error) {
		console.log('ERROR:' + error);
		return {
			status: 404,
			error: `State ${params.id} not found.`
		};
	}

	return { body: { state, uuid: params.id } };
};

const backwardsCompatability = (state: State) => {
	if (state.version == undefined) {
		state = v0tov1(state);
	}
	if (state.version == 1) {
		state = v1tov2(state);
	}

	return state;
};

const v0tov1 = (state: State) => {
	console.log('v0 -> v1');
	state.version = 1;
	state.deadzones = [];
	state.skidsteers = [];
	return state;
};

const v1tov2 = (state: State) => {
	console.log('v1 -> v2');
	state.version = 2;
	state.servos.forEach(servo => {
		servo.buttonMinus = -1;
		servo.buttonPlus = -1;
		servo.buttonSpeed = 0;
	});
	return state;
};
