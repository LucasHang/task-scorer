<script lang="ts">
	import { onMount } from 'svelte';
	import { clsx } from 'clsx';

	import { updateParticipant } from '$lib/api';
	import type Participant from '$lib/types/participant';

	export let partyId: string;
	export let scoreSystem: Array<string>;
	export let participants: Array<Participant>;
	export let selectedParticipant: Participant;

	/** @todo não precisaria dar update do score, somente quando desse ready */
	const handleSelectScore = async (value: string) => {
		let newSelectedScore: string | null = value;
		if (value === selectedParticipant.selectedScore) {
			newSelectedScore = null;
		}

		await updateParticipant(partyId, participants, {
			id: selectedParticipant.id,
			selectedScore: newSelectedScore,
			ready: false
		});
	};

	const toggleReady = async () => {
		await updateParticipant(partyId, participants, {
			id: selectedParticipant.id,
			ready: !selectedParticipant.ready
		});
	};

	onMount(async () => {
		await updateParticipant(partyId, participants, {
			id: selectedParticipant.id,
			selectedScore: null,
			ready: false
		});
	});
</script>

<p class="text-center">
	Here you can choose the score and check the "ready" switch when you feel safe.<br />
	When all players are ready the result will be shown.
</p>
<br />

<div
	class="flex flex-col justify-center items-center bg-base-200 shadow-xl rounded-box py-3 px-6 my-3"
>
	<h1 class="text-lg text-center font-thin mb-6">
		Playing as {selectedParticipant.id} - {selectedParticipant.name}
	</h1>

	<div class="flex justify-center items-center gap-2 flex-wrap max-w-3xl">
		{#each scoreSystem as scoreNote}
			<button
				class={clsx('min-w-[50px] min-h-[48px] btn bg-secondary text-secondary-content', {
					'bg-success': scoreNote === selectedParticipant.selectedScore
				})}
				on:click={() => handleSelectScore(scoreNote)}
			>
				{scoreNote}
			</button>
		{/each}
	</div>

	<div class="form-control w-48 mt-4">
		<label class="cursor-pointer label">
			<span class="label-text">I'm f#ck!ng ready!!</span>
			<input
				type="checkbox"
				on:change={toggleReady}
				checked={selectedParticipant.ready}
				disabled={!selectedParticipant.selectedScore}
				class="toggle toggle-accent"
			/>
		</label>
	</div>
</div>

<ul class="menu p-2 m-4">
	{#each participants as participant (participant.id)}
		<li class="bg-ghost">
			<div class="flex flex-row justify-center items-center gap-2">
				{participant.id} - {participant.name}

				{#if participant.ready}
					<div class="badge badge-accent">ready</div>
				{:else}
					<div class="badge">thinking...</div>
				{/if}
			</div>
		</li>
	{/each}
</ul>
