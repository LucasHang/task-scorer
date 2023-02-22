<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
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
</script>

<section>
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
						class="input input-ghost flex-1"
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
						class="input input-ghost flex-1"
						bind:value={newPartyName}
					/>

					<button class="btn btn-primary" on:click={createParty}>Throw</button>
				</div>
			</div>
		</div>
	</div>
</section>
