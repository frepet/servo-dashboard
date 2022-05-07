import type { RequestHandler } from '@sveltejs/kit';
import type pgPromise from 'pg-promise';
import type pg from 'pg-promise/typescript/pg-subset';

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

type getParams = {
	id: string;
};

export const get: RequestHandler = async ({ params, locals }) => {
	let body = {
		state: {
			uuid: params.id,
			name: '-',
			pwms: [],
			servos: []
		}
	};

	try {
		await locals.dbc
			.one('SELECT state FROM states WHERE uuid = $1', [params.id])
			.then((data: any) => {
				body.state = data['state'];
			});
	} catch (error) {
		console.log('ERROR:' + error);
		return {
			status: 404,
			error: new Error(`State ${params.id} not found.`)
		};
	}

	body.state.uuid = params.id;
	return { body };
};

export const post: RequestHandler = async ({ request, params, locals }) => {
	let state = {
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
		body: 'OK'
	};
};

export const del: RequestHandler = async ({ locals, params }): Promise<{}> => {
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
