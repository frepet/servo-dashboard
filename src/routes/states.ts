import type pgPromise from 'pg-promise';
import type pg from 'pg-promise/typescript/pg-subset';

export interface State {
	uuid: string;
	state: {
		name: string;
	};
}

export const get = async (request: {
	local: { dbc: pgPromise.IDatabase<{}, pg.IClient> };
}): Promise<{ body: { states: {[key: string]: string}} }> => {

    let body = { states: {}};

	try {
		await request.local.dbc
			.manyOrNone('SELECT uuid, state FROM states')
			.then((data: Array<State>) => {
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