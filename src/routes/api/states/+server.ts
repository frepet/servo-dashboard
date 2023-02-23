import type { State } from '$lib/types';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }): Promise<{ body: { uuid: string } }> {

	const body = { uuid: '' };
	const reqBody = await request.json();

	try {
		const resp = await locals.dbc.one('INSERT INTO states (state) VALUES ($1) RETURNING uuid', [
			reqBody
		]);
		body.uuid = resp.uuid;
	} catch (error) {
		console.log(error);
	}

	return { body };
};

/** @type {import('./$types').RequestHandler} */
export async function GET({ locals }) {
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
