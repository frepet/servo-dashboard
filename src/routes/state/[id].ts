import type pgPromise from 'pg-promise';
import type pg from 'pg-promise/typescript/pg-subset';

export interface State {
	uuid: string,
	name: string;
	pwms: number[];
}

type getParams = {
	id: string;
};

export const get = async (request: {
	params: getParams;
	local: { dbc: pgPromise.IDatabase<Record<string, unknown>, pg.IClient> };
}): Promise<{ body: { state: State } } | { status: number, error: Error } > => {
	let body = {
		state: {
			uuid: request.params.id,
			name: '-',
			pwms: []
		}
	};

	try {
        await request.local.dbc.one('SELECT state FROM states WHERE uuid = $1', [request.params.id])
            .then((data: any) => {
                body.state = data['state'];
            });
	} catch (error) {
		console.log('ERROR:' + error);
		return { 
			status: 404,
			error: new Error(`State ${request.params.id} not found.`)
		};
	}

 	body.state.uuid = request.params.id;
	return { body };
};
