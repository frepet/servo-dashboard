import type { RequestHandler } from '@sveltejs/kit';

export interface State {
	uuid: string;
	state: {
		name: string;
	};
}

export const get: RequestHandler = async ({ locals }) => {
	let body = { states: {} };

	try {
		await locals.dbc.manyOrNone('SELECT uuid, state FROM states').then((data: Array<State>) => {
			const stateIdentifiers = new Map<string, string>(
				data.map(({ uuid, state }) => {
					return [uuid, state['name']];
				})
			);
			body = {
				states: Object.fromEntries(stateIdentifiers)
			};
		});
	} catch (error) {
		console.log(error);
	}

	return { body };
};
