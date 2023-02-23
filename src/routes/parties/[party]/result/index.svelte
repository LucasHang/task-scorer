<script lang="ts">
	import { page } from '$app/stores';

	import type Participant from '$lib/types/participant';

	import { currentParty } from '$lib/stores/currentParty';
	import useParty from '$lib/hooks/useParty';
	import Result from '$lib/result/Result.svelte';
	import Loading from '$lib/loading/Loading.svelte';

	const partyStore = useParty($page.params.party);

	const checkAllReady = (participants?: Array<Participant>) => {
		if (!participants || !participants.length) {
			return;
		}

		const ready = participants.filter((p) => p.ready && p.selectedScore);

		return ready.length == participants.length;
	};

	$: allParticipantsReady = checkAllReady($partyStore?.participants);
	$: goBackUrl = $currentParty?.participantId
		? `/parties/${$page.params.party}/scoring/${$currentParty.participantId}`
		: `/parties/${$page.params.party}`;
</script>

<section>
	{#if !!$partyStore}
		<div class="flex flex-col items-center mb-20 mt-4">
			<h1 class="text-3xl font-bold inline-flex items-center">Scoring Results</h1>
		</div>

		{#if allParticipantsReady}
			<Result
				partyId={$page.params.party}
				participants={$partyStore.participants}
				role={$currentParty?.role || 'guest'}
				{goBackUrl}
			/>
		{:else}
			<h1>
				Not all participants are ready, <a href={goBackUrl} class="link">Go back to Scoring</a>
			</h1>
		{/if}
	{:else}
		<Loading />
	{/if}
</section>
