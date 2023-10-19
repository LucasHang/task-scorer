<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	import type Participant from '$lib/types/participant';

	import useParty from '$lib/hooks/useParty';
	import Scorer from '$lib/scorer/Scorer.svelte';
	import Loading from '$lib/loading/Loading.svelte';
	import CelebrationIcon from '$lib/icons/CelebrationIcon.svelte';

	const partyStore = useParty($page.params.party);

	const checkAllReady = (participants?: Array<Participant>) => {
		if (!participants || !participants.length) {
			return;
		}

		const ready = participants.filter((p) => p.ready && p.selectedScore);

		if (ready.length === participants.length) {
			goto(`/parties/${$page.params.party}/result`);
		}
	};

	$: selectedParticipant = $partyStore?.participants.find((p) => p.id === $page.params.participant);

	$: checkAllReady($partyStore?.participants);
</script>

<section>
	{#if !!$partyStore && !!selectedParticipant}
		<div class="flex flex-col items-center mb-20 mt-4">
			<h1
				class="text-2xl md:text-3xl font-bold inline-flex text-center justify-center items-center flex-wrap gap-2"
			>
				OI, you are in "{$partyStore.name}" party
				<CelebrationIcon />
			</h1>

			<a href={`/parties/${$page.params.party}`} class="btn btn-outline btn-error btn-xs mt-2">
				Back to Main Hall
			</a>
		</div>

		<Scorer
			partyId={$page.params.party}
			scoreSystem={$partyStore.scoreSystem}
			participants={$partyStore.participants}
			{selectedParticipant}
		/>
	{:else}
		<Loading />
	{/if}
</section>
