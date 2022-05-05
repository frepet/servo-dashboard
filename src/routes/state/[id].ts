export interface State {
	id: string;
	name: string;
}

type getParams = {
	id: string;
};

export const get = async (request: { params: getParams }): Promise<{ body: { state: State } }> => {
	console.log(request.params);

	const state: State = {
		id: request.params.id,
		name: 'Robotdags'
	};

	return { body: { state } };
};
