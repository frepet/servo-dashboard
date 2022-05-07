import type { State } from '$lib/interfaces';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ params, locals }) => {
	let state: State;

	try {
		const resp = await locals.dbc.one('SELECT state FROM states WHERE uuid = $1', [params.id]);
		state = resp['state'];
	} catch (error) {
		console.log('ERROR:' + error);
		return {
			status: 404,
			error: `State ${params.id} not found.`
		};
	}

	return { body: { state, uuid: params.id} };
};
