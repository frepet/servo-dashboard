import type { RequestHandler } from '@sveltejs/kit';

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
