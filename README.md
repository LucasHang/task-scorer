# Motivation

Teams that work with Scrum methodology often go through the *scoring* process of their tasks to plan a sprint.
Unfortunately, my team run out of free online options for *scoring*, so I made my own.

# Tech Stack

I was looking for something fast and new, specially avoiding the need of database and server.
So for developing the frontend I choose SvelteKit (which I vary much recommend) and for sharing + storing data I used a peer to peer library called [Gun.js](https://gun.eco).

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
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
