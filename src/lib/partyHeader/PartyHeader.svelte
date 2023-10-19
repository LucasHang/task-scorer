<script lang="ts">
	import { updateParty } from '$lib/api';
	import type CurrentParty from '$lib/types/currentParty';
	import type Party from '$lib/types/party';
	import CelebrationIcon from '$lib/icons/CelebrationIcon.svelte';
	import CopyIcon from '$lib/icons/CopyIcon.svelte';
	import CheckIcon from '$lib/icons/CheckIcon.svelte';
	import TimesIcon from '$lib/icons/TimesIcon.svelte';

	export let party: Party;
	export let role: CurrentParty['role'];
	export let onLeave: () => void;
	export let onEnd: () => void;

	let tipMessage = 'Copy to clipboard';
	let scoreSystemInput = party.scoreSystem.join(', ');
	let scoreSystemError = '';

	function copyPartyKey() {
		navigator.clipboard.writeText(party.id);
		tipMessage = 'Copied!';
	}

	function resetTipMessage() {
		tipMessage = 'Copy to clipboard';
	}

	async function updateScoreSystem() {
		const newScoreSystem = scoreSystemInput.split(',').map((value) => value.trim());

		await updateParty(party.id, { scoreSystem: newScoreSystem })
			.then(() => {
				scoreSystemInput = newScoreSystem.join(', ');
			})
			.catch((error) => {
				scoreSystemError = error.message;
			});
	}

	function resetScoreSystem() {
		scoreSystemInput = party.scoreSystem.join(', ');
		scoreSystemError = '';
	}

	$: scoreSystemInputChanged = scoreSystemInput !== party.scoreSystem.join(', ');
</script>

<div class="flex flex-col items-center gap-1 mb-20 mt-4">
	<h1
		class="text-2xl md:text-3xl font-bold text-center inline-flex items-center justify-center flex-wrap gap-2"
	>
		OI, you are in "{party.name}" party
		<CelebrationIcon />
	</h1>

	{#if role === 'host'}
		<strong>
			Party Key:
			<div class="tooltip" data-tip={tipMessage}>
				<button
					class="btn btn-sm btn-outline btn-accent gap-2 ml-1"
					on:click={copyPartyKey}
					on:mouseenter={resetTipMessage}
				>
					{party.id}
					<CopyIcon />
				</button>
			</div>
		</strong>

		<div class="flex items-center gap-1">
			<span class="whitespace-nowrap">Score System:</span>
			<input
				type="text"
				placeholder="Score system"
				class="input input-bordered input-sm w-full max-w-md ml-1"
				bind:value={scoreSystemInput}
			/>

			<button
				class="btn btn-xs btn-square btn-accent btn-success"
				style={`transform:scale(${scoreSystemInputChanged ? 1 : 0})`}
				on:click={updateScoreSystem}
			>
				<CheckIcon />
			</button>
			<button
				class="btn btn-xs btn-square btn-accent btn-error"
				style={`transform:scale(${scoreSystemInputChanged ? 1 : 0})`}
				on:click={resetScoreSystem}
			>
				<TimesIcon />
			</button>
		</div>

		{#if scoreSystemInputChanged && scoreSystemError}
			<div class="toast toast-end absolute bottom-8 right-8">
				<div class="alert alert-error">
					<div>
						<span>{scoreSystemError}</span>
					</div>
				</div>
			</div>
		{/if}
	{/if}

	{#if role === 'host'}
		<button class="btn btn-outline btn-error btn-xs mt-2" type="button" on:click={onEnd}>
			END the party
		</button>
	{:else}
		<button class="btn btn-outline btn-error btn-xs mt-2" type="button" on:click={onLeave}>
			LEAVE the party
		</button>
	{/if}
</div>
