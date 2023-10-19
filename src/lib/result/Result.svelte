<script lang="ts">
	import { goto } from '$app/navigation';

	import type Participant from '$lib/types/participant';
	import type CurrentParty from '$lib/types/currentParty';

	import { updateParticipants } from '$lib/api';
	import StatsForQuantitativeScores from './StatsForQuantitativeScores.svelte';
	import StatsForQualitativeScores from './StatsForQualitativeScores.svelte';

	export let partyId: string;
	export let participants: Array<Participant>;
	export let role: CurrentParty['role'];
	export let goBackUrl: string;

	const reset = async () => {
		const newParticipants = participants.map((participant) => {
			return { ...participant, ready: false, selectedScore: null };
		});

		await updateParticipants(partyId, newParticipants);

		goto(goBackUrl);
	};

	const allScores = participants.map((p) => p.selectedScore || '0');

	const anyQualitativeScore = allScores.some((scoreNote) => Number.isNaN(Number(scoreNote)));
	console.log('🚀 ~ file: Result.svelte:29 ~ anyQualitativeScore:', anyQualitativeScore);

	let allQuantitativeScores: Array<number> = [];

	if (!anyQualitativeScore) {
		allQuantitativeScores = allScores.map((scoreNote) => Number(scoreNote));
	}
</script>

{#if !!anyQualitativeScore}
	<StatsForQualitativeScores quantityOfParticipants={participants.length} scores={allScores} />
{:else}
	<StatsForQuantitativeScores
		quantityOfParticipants={participants.length}
		scores={allQuantitativeScores}
	/>
{/if}

<ul class="menu p-2 m-4">
	{#each participants as participant (participant.id)}
		<li class="bg-ghost">
			<div class="flex flex-row justify-center items-center gap-2">
				{participant.id} - {participant.name}

				<div class="avatar placeholder">
					<div class="bg-neutral-focus text-neutral-content rounded-full w-8">
						<span class="text-xs">{participant.selectedScore}</span>
					</div>
				</div>
			</div>
		</li>
	{/each}
</ul>

{#if role === 'host'}
	<button class="btn btn-error m-2" type="button" on:click={reset}>Play again</button>
{/if}
