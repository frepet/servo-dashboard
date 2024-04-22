import type { State } from '$lib/types';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, locals }) {
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

	return new Response(String({ body: state }));
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, params, locals }) {
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
	return new Response(
		String({
			status: 200,
			body: { state }
		})
	);
}

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ locals, params }) {
	try {
		await locals.dbc.none('DELETE FROM states WHERE uuid = $1', [params.id]);
		return {
			body: 'OK'
		};
	} catch (error) {
		console.log(error);
		return new Response(
			String({
				status: 500
			})
		);
	}
}
