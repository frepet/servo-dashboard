import type { RequestHandler } from '@sveltejs/kit';

export const post: RequestHandler = async ({
	request,
	locals
}): Promise<{ body: { uuid: string } }> => {
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
