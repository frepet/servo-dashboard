import type { RequestHandler } from '@sveltejs/kit';

export interface Servo {
	id: number;
	axis: number;
	min: number;
	max: number;
	startValue: number;
	speed: number;
}

export interface State {
	uuid: string;
	name: string;
	pwms: number[];
	servos: Servo[];
}

export const get: RequestHandler = async ({ params, locals }) => {
	const body = {
		state: {
			uuid: params.id,
			name: '-',
			pwms: [],
			servos: []
		}
	};

	try {
		const resp = await locals.dbc.one('SELECT state FROM states WHERE uuid = $1', [params.id]);
		body.state = resp['state'];
	} catch (error) {
		console.log('ERROR:' + error);
		return {
			status: 404,
			error: `State ${params.id} not found.`
		};
	}

	body.state.uuid = params.id;
	return { body };
};

export const post: RequestHandler = async ({ request, params, locals }) => {
	const state = {
		...(await request.json()),
		uuid: params.id
	};

	try {
		await locals.dbc.none('UPDATE states SET state = $1 WHERE uuid = $2', [state, state.uuid]);
	} catch (error) {
		console.log(error);
		return {
			status: 500,
			body: 'Could not update state'
		};
	}
	return {
		status: 200,
		body: { state }
	};
};

export const del: RequestHandler = async ({ locals, params }) => {
	try {
		await locals.dbc.none('DELETE FROM states WHERE uuid = $1', [params.id]);
		return {
			body: 'OK'
		};
	} catch (error) {
		console.log(error);
		return {
			status: 500
		};
	}
};
