import type { RequestHandler } from '@sveltejs/kit';

export const post: RequestHandler = async ({
	request,
	locals
}): Promise<{ body: { uuid: string } }> => {
	const body = { uuid: '' };
	const reqBody = await request.json();

	try {
		await locals.dbc
			.one('INSERT INTO states (state) VALUES ($1) RETURNING uuid', [reqBody])
			.then((data: string) => {
				body.uuid = data;
			});
	} catch (error) {
		console.log(error);
	}

	return { body };
};
