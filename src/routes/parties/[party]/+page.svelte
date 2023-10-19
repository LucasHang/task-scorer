<script lang="ts">
	import { page } from '$app/stores';

	import { deleteParticipant, deleteParty } from '$lib/api';
	import { currentParty } from '$lib/stores/currentParty';

	import useParty from '$lib/hooks/useParty';
	import Participants from '$lib/participants/Participants.svelte';
	import Loading from '$lib/loading/Loading.svelte';
	import PartyHeader from '$lib/partyHeader/PartyHeader.svelte';

	const partyStore = useParty($page.params.party);

	const leaveParty = async () => {
		if ($currentParty && $currentParty.participantId) {
			const participantToDeleteId = $currentParty.participantId;
			const participantToDelete = $partyStore?.participants.find(
				(p) => p.id === participantToDeleteId
			);

			if (participantToDelete) {
				await deleteParticipant($currentParty.partyId, participantToDelete);
			}

			currentParty.set(null);
		} else {
			currentParty.set(null);
		}
	};

	const endParty = async () => {
		// Parties set should be already being listened, so we only have
		// to kill it to a `party over` behavior be triggered
		await deleteParty($page.params.party);
	};
</script>

<section>
	{#if !!$partyStore}
		<PartyHeader
			party={$partyStore}
			role={$currentParty?.role || 'guest'}
			onLeave={leaveParty}
			onEnd={endParty}
		/>

		<Participants party={$partyStore} />
	{:else}
		<Loading />
	{/if}
</section>
