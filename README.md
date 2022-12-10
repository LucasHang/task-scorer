# Presentation

## Motivation

Teams that work with Scrum methodology often go through the *scoring* process of their tasks to plan a sprint.
Unfortunately, my team run out of free online options for *scoring*, so I made my own.

This is **Task Scorer**, application for *scoring* anything you want *in group* using *Fibonacci sequence*. 

## Tech Stack

I was looking for something:
- Fast to develop
- With realtime updates
- Auto-managed database and server
- Something new to learn about
- FREE!

So for developing the frontend I choose:
- [SvelteKit](https://kit.svelte.dev) as framework (which I very much recommend)
- [Tailwindcss](https://tailwindcss.com) with [daisyUI](https://daisyui.com/) for styles

And as backend I choose:
- [Firebase](https://firebase.google.com/docs) for saving and sharing data (mostly firestore)

As hosting platform I'm using [Vercel](https://vercel.com), no stress.

## Experience

All the experience about task-scoring with the team I work with and the **Task Scorer** development will be shared at this Medium post: *...working on it...*

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
