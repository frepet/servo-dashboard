/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
	interface Locals {
		dbc?: pgPromise.IDatabase<Record<string, string>, pg.IClient>;
	}
	// interface Platform {}
	// interface Session {}
	// interface Stuff {}
}
