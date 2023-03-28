# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm init svelte

# create a new project in my-app
npm init svelte my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
DATABASE_URL="POSTGRES CONNECTION STRING" npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Local Developing

Start the local database

```bash
docker-compose up db -d
```

Init theme and create database table, just needed once

```
npm run smui-theme-dark

docker exec servo-dashboard-db-1  psql -U servodashboard -c 'CREATE TABLE states (
  uuid UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  state JSON
);'
```

Set environment variables and start dev

```
export DATABASE_URL=postgres://servodashboard:somelongsecret@localhost:5432
export NO_SSL="true"
```

```
npm run dev -- --open
```

Create new state

```
curl -X POST localhost:8080/state -H 'Content-Type: application/json' -d '{"name": "","deadzones": [],"servos": [],"skidsteers": [],"macros": [],"swapButton": -1}'
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.