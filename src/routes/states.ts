import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ locals }) => {
	let body = {};

	try {
		const resp = await locals.dbc.manyOrNone('SELECT uuid, state FROM states');
		const stateIdentifiers = new Map<string, string>(
			resp.map(({ uuid, state }) => {
				return [uuid, state.name];
			})
		);
		body = Object.fromEntries(stateIdentifiers);
	} catch (error) {
		console.log(error);
	}

	return { body };
};
