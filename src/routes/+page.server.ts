/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	let saves: string[] = [];

	try {
		const resp = await locals.dbc.many('SELECT * FROM states');
		saves = resp;
	} catch (error) {
		console.log('ERROR:' + error);
		return {
			status: 500,
			error: `Could not get saves from database.`
		};
	}
	// console.log(saves);
	return { body: { saves } };
}
