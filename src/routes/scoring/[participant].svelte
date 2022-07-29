<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    
    import type Participant from '$lib/types/participant';

    import Scorer from '$lib/scorer/Scorer.svelte';
    import { watchParticipants } from '$lib/api';

    let participantsStore: Array<Participant> = [];

    onMount(() => {
        console.log('page', $page.params.participant);

        watchParticipants(participantsStore, newParticipants => {
            participantsStore = newParticipants;
        });
	});

    $: participants = participantsStore;
    $: selectedParticipant = participants.find(p => p.id === $page.params.participant);

    $: allParticipantsReady = 
        participants.length > 0 && 
        !participants.find(item => !item.ready || !item.selectedScore);

    $: allParticipantsReady && goto('/result');
</script>

<section>
    {#if selectedParticipant}
        <Scorer participants={participants} selectedParticipant={selectedParticipant} />
    {:else}
        <h1>Loading...</h1>
    {/if}
</section>
