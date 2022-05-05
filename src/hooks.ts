import 'dotenv/config';
import pgPromise from 'pg-promise';

const initOptions = {};
const pgp = pgPromise(initOptions);
const cn = {
	connectionString: process.env.DATABASE_URL,
	ssl: process.env.NO_SSL ? false : { rejectUnauthorized: false }
};
const db = pgp(cn);

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	event.local = { dbc: db };

	const response = await resolve(event);
	return response;
}
