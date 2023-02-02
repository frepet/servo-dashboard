import type { RequestHandler } from '@sveltejs/kit';
import type { State } from '$lib/types';

export const get: RequestHandler = async ({ locals }) => {
	let body = {};

	try {
		const resp = await locals.dbc.manyOrNone('SELECT uuid, state FROM states');
		const stateIdentifiers = new Map<string, string>(
			resp.map(({ uuid, state }: { uuid: string; state: State }) => {
				return [uuid, state.name];
			})
		);
		body = Object.fromEntries(stateIdentifiers);
	} catch (error) {
		console.log(error);
	}

	return { body };
};
