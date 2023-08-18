<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import Balancer from 'svelte-wrap-balancer';
	import { clsx } from 'clsx';
	import { currentParty } from '$lib/stores/currentParty';
	import { createParty as createPartyApi } from '$lib/api';

	let partyKey = '';
	let partyKeyPlaceholder = 'Party Key goes here';

	let newPartyName = '';
	let newPartyNamePlaceholder = 'Party name goes here';

	const joinParty = () => {
		if (!partyKey) {
			partyKeyPlaceholder += ' !';
			return;
		}

		currentParty.set({ partyId: partyKey, role: 'guest' });
	};

	const createParty = async () => {
		if (!newPartyName) {
			newPartyNamePlaceholder += ' !';
			return;
		}

		const newParty = await createPartyApi(newPartyName);

		if (newParty) {
			currentParty.set({ partyId: newParty.id, role: 'host' });
		}
	};

	const onChangePartyKey = (newPartyKey: string) => {
		if (newPartyKey) {
			partyKeyPlaceholder = 'Party Key goes here';
		}
	};

	const onChangePartyName = (newPartyName: string) => {
		if (newPartyName) {
			newPartyNamePlaceholder = 'Party Key goes here';
		}
	};

	$: onChangePartyKey(partyKey);
	$: onChangePartyName(newPartyName);
</script>

<section class="justify-evenly">
	<div class="w-full max-w-[768px] px-4">
		<h1 class="text-2xl font-bold text-center mb-2">
			<Balancer>
				<span
					>Here you find a perfect space to <span class="border-b-accent border-b-2"
						>score your tasks</span
					></span
				>
			</Balancer>
		</h1>
		<h3 class="text-center">
			<Balancer>
				<span class="text-xl font-light italic">Made for those who want this to end quickly</span>
				<span class="text-2xl text-accent mx-2">&</span>
				<span class="text-xl font-light italic">And for those who want it done right</span>
			</Balancer>
		</h3>
	</div>

	<div>
		<p class="text-neutral-content text-center mb-6 text-sm">All starts with a Party...</p>

		<div class="flex flex-col justify-center items-center w-full lg:flex-row">
			<div class="card w-96 bg-base-100 shadow-xl image-full">
				<figure><img src="meteor.svg" alt="Join a Party" /></figure>

				<div class="card-body">
					<h2 class="card-title">Join a Party!</h2>

					<p>If you have a <b>Party Key</b>, come this way.</p>

					<div class="card-actions justify-end">
						<input
							type="text"
							placeholder={partyKeyPlaceholder}
							class={clsx('input input-ghost flex-1', {
								'border-error': partyKeyPlaceholder.includes('!')
							})}
							bind:value={partyKey}
						/>

						<button class="btn btn-primary" on:click={joinParty}>Join</button>
					</div>
				</div>
			</div>

			<div class="divider my-8 lg:divider-horizontal lg:mx-8">OR</div>

			<div class="card w-96 bg-base-100 shadow-xl image-full">
				<figure><img src="colored-shapes.svg" alt="Throw a Party" /></figure>

				<div class="card-body">
					<h2 class="card-title">Throw a Party!</h2>

					<p>Want to be the boss?? I'll show you how.</p>

					<div class="card-actions justify-end">
						<input
							type="text"
							placeholder={newPartyNamePlaceholder}
							class={clsx('input input-ghost flex-1', {
								'border-error': newPartyNamePlaceholder.includes('!')
							})}
							bind:value={newPartyName}
						/>

						<button class="btn btn-primary" on:click={createParty}>Throw</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
