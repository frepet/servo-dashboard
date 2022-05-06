import type pgPromise from 'pg-promise';
import type pg from 'pg-promise/typescript/pg-subset';

export const post = async ({ request, local }): Promise<{ body: { uuid: string } }> => {
	let body = { uuid: "" };
    const reqBody = await request.json();

    try {
        await local.dbc.one('INSERT INTO states (state) VALUES ($1) RETURNING uuid', [reqBody])
            .then((data: string) => {
                body.uuid = data; 
            });
	} catch (error) {
		console.log(error);
	}

	return { body };
};
