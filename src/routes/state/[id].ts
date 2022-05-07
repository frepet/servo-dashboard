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

	return { body: state };
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
