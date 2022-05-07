import type { Handle } from '@sveltejs/kit';
import 'dotenv/config';
import pgPromise from 'pg-promise';

const initOptions = {};
const pgp = pgPromise(initOptions);
const cn = {
	connectionString: process.env.DATABASE_URL,
	ssl: process.env.NO_SSL ? false : { rejectUnauthorized: false }
};
const db = pgp(cn);

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.dbc = db;

	const response = await resolve(event);
	return response;
};
